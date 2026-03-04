import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
    const options = {
        maxSizeMB: 1,            // Target max size 1MB
        maxWidthOrHeight: 2560,  // Keep it HD (up to 2560px)
        useWebWorker: true,
        initialQuality: 0.85,    // High initial quality
    };

    try {
        const compressedBlob = await imageCompression(file, options);
        // Convert back to File to maintain filename and lastModified
        return new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error('Compression error:', error);
        return file; // Return original file if compression fails
    }
}
