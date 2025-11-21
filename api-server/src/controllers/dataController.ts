import { Request, Response } from 'express';

export const ingestDataController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // For now, just confirm file reception
    console.log('File received:', req.file);

    // TODO: Process the JSON file using LangChain
    // TODO: Save processed data to Vector Store or database

    res.status(200).json({
      message: 'File uploaded and received successfully.',
      filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Error ingesting data:', error);
    res.status(500).json({ message: 'Error processing file.' });
  }
};
