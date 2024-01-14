import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './Button.css';
import {IoMdCloudUpload} from 'react-icons/io';
import Loading from './Loading';
import FailureLoading from './FailureLoading';
import SuccessLoading from './SuccessLoading';

export interface ButtonProps {
  buttonName: string;
  uploadUrl: string;
}

export function Button({ buttonName, uploadUrl }: ButtonProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Specify the type as File | null
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successUploadMessage, setSuccessUploadMessage] = useState<string>('');
  const [errorMessageUpload, setErrorMessageUpload] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);
  const [successLoading, setSuccessLoading] = useState<boolean>(false);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please upload a CSV file');
      return;
    }

    const headers = {
      'Authorization': 'Bearer abcde',
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(uploadUrl,
        formData, {
        withCredentials: true,
        headers: headers,
      });
      console.log('response', response);

      if (response.data.result && response.data.result[0].responseCode === 'OK') {
        console.log('response', response.data.result[0].responseCode);
        setSuccessLoading(true);
       setSuccessUploadMessage('File uploaded successfully');
      }
    } catch (error) {
      setErrorLoading(true);
      if (axios.isAxiosError(error)) {
        setErrorMessageUpload(error.response?.data);
      }
    } 
    finally {
      setTimeout(() => {
        setErrorMessage('');
        setErrorMessageUpload('');
        setSuccessUploadMessage('');
        setLoading(false);
        setErrorLoading(false);
        setSuccessLoading(false);
        setSelectedFile(null);
      }, 3000);
    }
  };


  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      console.log('csvfile', file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx, .xls, .csv',
    multiple: false,
  });

  return (
    <div className="container">
      {
        loading ? (
          <div>
            {successLoading ?

            <div className='success-loading center'>
<SuccessLoading/> 
{successUploadMessage && <div className="upload-success">{successUploadMessage}</div>}
            </div>
             
             
             :errorLoading ? 
             <div className='failure-loading center'>
<FailureLoading/> 
{errorMessageUpload && <div className="error-message">{errorMessageUpload}</div>}
             </div>
             
             
             :<Loading/>}
          </div>
        ):
        (
          <>
           <div {...getRootProps()} className="upload-form">
        <input {...getInputProps()} id="excelInput" required accept=".csv"  />
        <div className="dropzone">
          <span className="file-upload-icon"> <IoMdCloudUpload style={{ color: '#7073f0' }}/> </span>
          {selectedFile ? <p>Selected File: {selectedFile.name}</p> : <p>Drag and drop your Excel or CSV file here</p>}
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    
      <button onClick={handleFileUpload}>{buttonName}</button>
          </>
        )
      }
     
    </div>
  );

}
