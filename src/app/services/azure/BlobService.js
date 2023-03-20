
const { BlobServiceClient } = require('@azure/storage-blob');
const { DateTime } = require('luxon');
const azure_conf = require('../../../config/azure');
const { app_path } = require('../../support/helpers/path');
const { Readable }  = require('stream');

class BlobService {

    static CLIENT;
    static CONNECTION_STRING;
    static DEFAULT_CONTAINER;

    static Client(){
        if(this.CLIENT) return this.CLIENT;
        return this.CLIENT = BlobServiceClient.fromConnectionString(this.ConnectString());
    }

    static ConnectString(){
        if(this.CONNECTION_STRING) return this.CONNECTION_STRING;
        return this.CONNECTION_STRING = azure_conf.blob.connection;
    }

    // downloads blob and stores to storagePath
    static async Download({blob, container, storagePath}){
        if(!storagePath) { storagePath = `blobs/${blob}-${DateTime.now()}` }

        const fileName = app_path(`storage/${storagePath}`);
      
        // download file
        await this.getBlobClient({blob, container}).then(client => {
            client.downloadToFile(fileName);
        });

        return fileName;
    }

    // downloads blob and returns contents as string.
    static async Open({blob, container}){
    
        const downloadResponse = await this.getBlobClient({blob,container}).then(client => {
            return client.download();
        });

        const readableStream = downloadResponse.readableStreamBody;
    
        const downloaded = await new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on('error', reject);
        });
        return downloaded.toString()
        
    }


    /**
     * 
     * @param uploadOptions : {
     *      metadata: { reviewer: 'john', reviewDate: '2022-04-01'},
     *      tags: { project: 'xyz', owner: 'accounts-payable'}
     * } 
     */
    static async Upload({content, blob, uploadOptions,container, type }){
        if(!blob) return null;
        
        const uploader = this.getUploader(type);

        return await this.getBlobUploadClient({blob,container}).then(async client => {
            await uploader({content,uploadOptions,client}).then(res => {
                return res;
            });
        });
    }

    /**
     * returns an uploader for the given content type.
     * defaults to readable stream.
     */
    static getUploader(contentType){
        const streamUploader = this.uploadReadableStream;
        const fileUploader = this.uploadFromFilePath;
        const UPLOADERS =  {
            stream: streamUploader,
            file: fileUploader,
        }
        return UPLOADERS[contentType] ??  UPLOADERS['stream'];
    }

    // content must be a fully qualified path and file name
    static async uploadFromFilePath({content, client, uploadOptions}){
        return client.uploadFile(content, uploadOptions);
    }

    static async uploadReadableStream({content, client, uploadOptions}){

        if(!(content instanceof Readable)){
            const readableStream = new Readable();
            readableStream.push(content);
            readableStream.push(null);
            content = readableStream;
        }
        
        return client.uploadStream(content, uploadOptions);
    }

    static async getBlobClient({blob, container}){
        if(!container) { container = this.getDefaultContainer(); }
        const containerClient = await this.Client().getContainerClient(container);

        const blobClient = await containerClient.getBlobClient(blob);
        return blobClient
    }

    static async getBlobUploadClient({blob, container}){
        if(!container) { container = this.getDefaultContainer(); }
        const containerClient = await this.Client().getContainerClient(container);

        const blobClient = await containerClient.getBlockBlobClient(blob);
        return blobClient
    }

    static getDefaultContainer(){
        if(this.DEFAULT_CONTAINER) return this.DEFAULT_CONTAINER;
        return this.DEFAULT_CONTAINER = azure_conf.blob.container;
    }


}


module.exports = {
    BlobService
}