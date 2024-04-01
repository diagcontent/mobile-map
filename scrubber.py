import csv

# Input CSV file path
input_file = 'ADD YOUR VOICE.csv'

# Output CSV file path
output_file = 'zipcodes.csv'

# Open the input CSV file
with open(input_file, 'r') as file:
    reader = csv.DictReader(file)
    
    # Get the index of the 'COUNTY' column
    headers = reader.fieldnames
    county_index = headers.index('COUNTY')
    
    # Open the output CSV file
    with open(output_file, 'w', newline='') as outfile:
        writer = csv.writer(outfile)
        
        # Write the header row
        writer.writerow(['COUNTY'])
        
        # Iterate over each row in the input CSV
        for row in reader:
            county = row[headers[county_index]]

            # Check if the county is a 5-digit zipcode
            if county.isdigit() and len(county.strip()) == 5:
                # Write the county to the output CSV
                writer.writerow([county])

print("CSV file created successfully.")