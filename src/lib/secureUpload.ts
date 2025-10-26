// Secure Upload Utility
// Uses the secure API route with service key (server-side only)

export interface UploadOptions {
  prefix?: string;
  isPublic?: boolean;
}

export interface UploadResponse {
  success: boolean;
  path: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  bucket: string;
}

export interface UploadError {
  error: string;
  details?: string;
  allowed?: string[];
  maxSize?: number;
  received?: number;
}

/**
 * Upload file securely using the API route with service key
 */
export async function uploadFileSecurely(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResponse> {
  try {
    // Validate file before upload
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/png',
      'image/jpeg', 
      'image/webp',
      'image/gif',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size: ${maxSize} bytes, received: ${file.size} bytes`);
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.prefix) {
      formData.append('prefix', options.prefix);
    }
    
    if (options.isPublic) {
      formData.append('public', 'true');
    }

    // Upload to secure API route — only awards prefix is supported via /api/awards/issue
    let uploadUrl: string;
    if (options.prefix === 'awards') {
      uploadUrl = '/api/awards/issue';
    } else {
      throw new Error('Secure upload for this prefix is not implemented. Use the appropriate server endpoint.');
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    // Check if the response is HTML (authentication page)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('API route is protected by authentication. Please disable Vercel protection or use direct storage upload.');
    }

    const data = await response.json();

    if (!response.ok) {
      const error = data as UploadError;
      throw new Error(error.details || error.error || 'Upload failed');
    }

    return data as UploadResponse;

  } catch (error) {
    console.error('Secure upload failed:', error);
    throw error;
  }
}

/**
 * Upload award image with proper prefix
 */
export async function uploadAwardImage(file: File): Promise<UploadResponse> {
  return uploadFileSecurely(file, {
    prefix: 'awards',
    isPublic: true
  });
}

/**
 * Upload profile avatar with proper prefix
 */
export async function uploadProfileAvatar(file: File): Promise<UploadResponse> {
  return uploadFileSecurely(file, {
    prefix: 'avatars',
    isPublic: true
  });
}

/**
 * Upload document with proper prefix
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  return uploadFileSecurely(file, {
    prefix: 'documents',
    isPublic: false // Documents might be private
  });
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/webp', 
    'image/gif',
    'application/pdf'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB, received: ${(file.size / 1024 / 1024).toFixed(1)}MB`
    };
  }

  return { valid: true };
}
