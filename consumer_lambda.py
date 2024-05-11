import boto3
import json
import base64
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    for record in event['Records']:
        partition_key= record['kinesis']['partitionKey']
        # Decode the payload from base64
        payload = base64.b64decode(record['kinesis']['data']).decode('utf-8')
        log_data= json.loads(payload)
        
        bucket_name = 'kinesis-receiver-nv'
        file_name = 'lambda/data.txt'  # You can change the file name as per your requirement
    
        # Write data to S3
        object_key= f"{partition_key}/{log_data['timestamp']}.json"
        s3_client.put_object(Bucket=bucket_name, 
                    Key=object_key, 
                    Body=json.dumps(log_data),
                    ContentType='application/json')

        
        
        
        
        print("Partion Key :", partition_key)
        print("data :", log_data)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Processed {} records.'.format(len(event['Records'])))
    }

    
    
