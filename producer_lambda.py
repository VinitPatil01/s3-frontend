import boto3
import json
import random
import time

# Initialize Kinesis client
kinesis_client = boto3.client('kinesis')

# Define the name of your Kinesis Data Stream
stream_name = 'project-stream'

def lambda_handler(event, context):
    for i in range(10):
        # Generate random data
        data = {
            'sensor_id': random.randint(1, 100),
            'temperature': round(random.uniform(20, 40), 2),
            'humidity': round(random.uniform(40, 80), 2),
            'timestamp': int(time.time())
        }
        
        # Convert data to JSON format
        data_json = json.dumps(data)
        print(data_json)
        # Put data records into Kinesis Data Stream
        response = kinesis_client.put_record(
            StreamName=stream_name,
            Data=data_json,
            PartitionKey=str(data['sensor_id'])
        )
        
        print(f"Data ingested into Kinesis Data Stream: {response['SequenceNumber']}")
        
        # Wait for 1 second before ingesting the next data
        time.sleep(1)