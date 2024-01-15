import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';

const useModelDownload = () => {
  const filePath = `${FileSystem.documentDirectory}ggml-model-q5_0.bin`;
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    checkAndDownloadModel();
  }, []);

  const checkAndDownloadModel = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (!fileInfo.exists) {
        // Model file does not exist, download it
        await downloadModel();
      }
    } catch (error) {
      console.error('Error checking/downloading model:', error);
    }
  };

  const downloadModel = async () => {
    try {
      const downloadUrl = 'https://huggingface.co/wcyat/whisper-small-yue-mdcc/resolve/main/ggml/ggml-model-q5_0.bin?download=true';

      // Download the file with progress tracking
      const download = FileSystem.createDownloadResumable(downloadUrl, filePath, {}, (downloadProgressEvent) => {
        const progress = downloadProgressEvent.totalBytesWritten / downloadProgressEvent.totalBytesExpectedToWrite;
        setDownloadProgress(progress);

        // Update notification content with progress
        updateNotificationProgress(progress);
      });

      await download.downloadAsync();

      // Display a notification after successful download
      displayNotification('Model Downloaded', 'The model.bin file has been downloaded successfully.');

      console.log('File downloaded to:', filePath);
    } catch (error) {
      console.error('Error downloading model:', error);
    }
  };

  const updateNotificationProgress = (progress: number) => {
    const content = {
      title: 'Downloading Model',
      body: `Progress: ${(progress * 100).toFixed(2)}%`,
    };

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        ...content,
      }),
    });
  };

  const displayNotification = (title: string, body: string) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // Display immediately
    });

    // Reset the notification handler to the default after the download is complete
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  };

  return {
    downloadProgress,
    checkAndDownloadModel,
  };
};

export default useModelDownload;
