package com.campus.campus_backend.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("uploads").toAbsolutePath().normalize();

    // Maximum uncompressed size for a zip file entry to prevent zip bombs (50 MB)
    private static final long MAX_UNCOMPRESSED_ENTRY_SIZE = 50 * 1024 * 1024;
    // Maximum number of entries inside a zip file
    private static final int MAX_ZIP_ENTRIES = 5000;
    // Maximum text file preview size (2 MB)
    private static final long MAX_TEXT_PREVIEW_SIZE = 2 * 1024 * 1024;

    private static final Set<String> ALLOWED_TEXT_EXTENSIONS = Set.of(
            "java", "js", "jsx", "ts", "tsx", "css", "html", "htm",
            "json", "xml", "md", "sql", "properties", "txt", "yml",
            "yaml", "env", "gitignore", "gradle", "bat", "sh", "py", "c", "cpp", "h"
    );

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of(
            "png", "jpg", "jpeg", "svg", "gif", "webp", "ico"
    );

    public FileStorageService() {
        try {
            Files.createDirectories(rootLocation);
            Files.createDirectories(rootLocation.resolve("proposals"));
            Files.createDirectories(rootLocation.resolve("final-reports"));
            Files.createDirectories(rootLocation.resolve("source-code"));
            Files.createDirectories(rootLocation.resolve("database"));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload storage folder", e);
        }
    }

    /**
     * Store an uploaded file safely and return relative path.
     */
    public String storeFile(MultipartFile file, String subDirectory, String... allowedExtensions) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid filename.");
        }

        // Clean filename and prevent path traversal
        String cleanedFilename = Paths.get(originalFilename).getFileName().toString();
        if (cleanedFilename.contains("..")) {
            throw new SecurityException("Filename contains invalid path sequence: " + cleanedFilename);
        }

        // Validate extension
        String extension = getFileExtension(cleanedFilename).toLowerCase();
        if (allowedExtensions != null && allowedExtensions.length > 0) {
            boolean extensionValid = false;
            for (String allowed : allowedExtensions) {
                if (allowed.equalsIgnoreCase(extension)) {
                    extensionValid = true;
                    break;
                }
            }
            if (!extensionValid) {
                throw new IllegalArgumentException("Invalid file type ." + extension + ". Allowed: " + Arrays.toString(allowedExtensions));
            }
        }

        // Generate unique safe storage name
        String uniqueFileName = UUID.randomUUID().toString() + "_" + sanitizeFilename(cleanedFilename);

        try {
            Path targetDir = this.rootLocation.resolve(subDirectory).normalize();
            if (!targetDir.startsWith(this.rootLocation)) {
                throw new SecurityException("Cannot store file outside current storage directory.");
            }
            Files.createDirectories(targetDir);

            Path targetLocation = targetDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return subDirectory + "/" + uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + cleanedFilename, e);
        }
    }

    /**
     * Load a file as Spring Resource safely.
     */
    public Resource loadFileAsResource(String relativePath) {
        try {
            if (relativePath == null || relativePath.trim().isEmpty() || relativePath.contains("..")) {
                throw new SecurityException("Invalid file path: " + relativePath);
            }

            String cleanPath = relativePath.trim().replace("\\", "/");
            if (cleanPath.startsWith("uploads/")) {
                cleanPath = cleanPath.substring(8);
            }

            // 1. Direct resolve
            Path filePath = this.rootLocation.resolve(cleanPath).normalize();
            if (filePath.startsWith(this.rootLocation) && Files.exists(filePath) && Files.isReadable(filePath) && !Files.isDirectory(filePath)) {
                return new UrlResource(filePath.toUri());
            }

            // 2. Try standard subdirectories
            String[] subDirs = {"proposals", "final-reports", "source-code", "database"};
            for (String dir : subDirs) {
                Path subPath = this.rootLocation.resolve(dir).resolve(cleanPath).normalize();
                if (subPath.startsWith(this.rootLocation) && Files.exists(subPath) && Files.isReadable(subPath) && !Files.isDirectory(subPath)) {
                    return new UrlResource(subPath.toUri());
                }
            }

            // 3. Search recursively for matching filename or UUID-prefixed file
            String simpleName = Paths.get(cleanPath).getFileName().toString();
            String sanitizedName = sanitizeFilename(simpleName);

            try (var stream = Files.walk(this.rootLocation, 3)) {
                Optional<Path> found = stream.filter(Files::isRegularFile)
                        .filter(p -> {
                            String fn = p.getFileName().toString();
                            return fn.equalsIgnoreCase(simpleName)
                                    || fn.equalsIgnoreCase(sanitizedName)
                                    || fn.endsWith("_" + simpleName)
                                    || fn.endsWith("_" + sanitizedName);
                        })
                        .findFirst();

                if (found.isPresent()) {
                    return new UrlResource(found.get().toUri());
                }
            } catch (Exception ignored) {}

            return null;
        } catch (MalformedURLException e) {
            return null;
        }
    }

    /**
     * Check if a file exists on disk.
     */
    public boolean fileExists(String relativePath) {
        Resource res = loadFileAsResource(relativePath);
        return res != null && res.exists();
    }

    /**
     * Safely read ZIP contents and return a tree/list structure.
     */
    public List<Map<String, Object>> getZipContents(String relativeZipPath) {
        if (relativeZipPath == null || relativeZipPath.trim().isEmpty() || relativeZipPath.contains("..")) {
            throw new SecurityException("Invalid ZIP path.");
        }

        Path zipFilePath = this.rootLocation.resolve(relativeZipPath).normalize();
        if (!zipFilePath.startsWith(this.rootLocation) || !Files.exists(zipFilePath)) {
            throw new RuntimeException("ZIP file not found on server.");
        }

        List<Map<String, Object>> entriesList = new ArrayList<>();

        try (ZipFile zipFile = new ZipFile(zipFilePath.toFile())) {
            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            int count = 0;

            while (entries.hasMoreElements()) {
                if (++count > MAX_ZIP_ENTRIES) {
                    throw new SecurityException("ZIP file contains too many entries (limit: " + MAX_ZIP_ENTRIES + ").");
                }

                ZipEntry entry = entries.nextElement();
                String entryName = entry.getName();

                // Zip Slip check
                if (entryName.contains("..") || entryName.startsWith("/") || entryName.startsWith("\\")) {
                    continue; // Skip dangerous entries safely
                }

                Map<String, Object> entryData = new HashMap<>();
                entryData.put("name", entryName);
                entryData.put("isDirectory", entry.isDirectory());
                entryData.put("size", entry.getSize());
                entryData.put("compressedSize", entry.getCompressedSize());

                String ext = getFileExtension(entryName).toLowerCase();
                entryData.put("extension", ext);
                entryData.put("isText", ALLOWED_TEXT_EXTENSIONS.contains(ext));
                entryData.put("isImage", ALLOWED_IMAGE_EXTENSIONS.contains(ext));

                entriesList.add(entryData);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read ZIP archive: " + e.getMessage(), e);
        }

        return entriesList;
    }

    /**
     * Safely read the content of a specific entry inside a ZIP archive.
     */
    public Map<String, Object> getZipEntryContent(String relativeZipPath, String entryPath) {
        if (relativeZipPath == null || relativeZipPath.contains("..") || entryPath == null || entryPath.contains("..")) {
            throw new SecurityException("Invalid path sequence.");
        }

        Path zipFilePath = this.rootLocation.resolve(relativeZipPath).normalize();
        if (!zipFilePath.startsWith(this.rootLocation) || !Files.exists(zipFilePath)) {
            throw new RuntimeException("ZIP file not found on server.");
        }

        Map<String, Object> result = new HashMap<>();
        String extension = getFileExtension(entryPath).toLowerCase();

        try (ZipFile zipFile = new ZipFile(zipFilePath.toFile())) {
            ZipEntry entry = zipFile.getEntry(entryPath);
            if (entry == null || entry.isDirectory()) {
                throw new RuntimeException("Entry not found in ZIP archive: " + entryPath);
            }

            if (entry.getSize() > MAX_TEXT_PREVIEW_SIZE) {
                result.put("truncated", true);
                result.put("message", "File is too large to preview directly (" + (entry.getSize() / 1024) + " KB). Please download the ZIP to view.");
                result.put("entryPath", entryPath);
                result.put("extension", extension);
                return result;
            }

            try (InputStream is = zipFile.getInputStream(entry)) {
                if (ALLOWED_TEXT_EXTENSIONS.contains(extension)) {
                    byte[] bytes = is.readNBytes((int) Math.min(entry.getSize() > 0 ? entry.getSize() : MAX_TEXT_PREVIEW_SIZE, MAX_TEXT_PREVIEW_SIZE));
                    String content = new String(bytes, StandardCharsets.UTF_8);
                    result.put("type", "text");
                    result.put("content", content);
                    result.put("extension", extension);
                    result.put("entryPath", entryPath);
                } else if (ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
                    byte[] bytes = is.readAllBytes();
                    String base64 = Base64.getEncoder().encodeToString(bytes);
                    result.put("type", "image");
                    result.put("content", "data:image/" + extension + ";base64," + base64);
                    result.put("extension", extension);
                    result.put("entryPath", entryPath);
                } else {
                    result.put("type", "binary");
                    result.put("message", "Binary file format ." + extension + " cannot be previewed directly.");
                    result.put("extension", extension);
                    result.put("entryPath", entryPath);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Error reading ZIP entry: " + e.getMessage(), e);
        }

        return result;
    }

    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1 || lastDot == filename.length() - 1) return "";
        return filename.substring(lastDot + 1);
    }

    private String sanitizeFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
