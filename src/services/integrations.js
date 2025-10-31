/**
 * Integrations - DISABLED
 * 
 * Base44 integrations are disabled. These features need to be reimplemented using:
 * - Supabase Edge Functions
 * - Direct API integrations
 * - Third-party services
 */

const notImplemented = () => {
  throw new Error('Base44 integrations disabled. Feature not available.');
};

export const Core = {};
export const InvokeLLM = notImplemented;
export const SendEmail = notImplemented;
export const UploadFile = notImplemented;
export const GenerateImage = notImplemented;
export const ExtractDataFromUploadedFile = notImplemented;
export const CreateFileSignedUrl = notImplemented;
export const UploadPrivateFile = notImplemented;






