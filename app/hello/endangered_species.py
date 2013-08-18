# Use django
from django.core.management import setup_environ
import settings
setup_environ(settings)
from hello.testapp.models import *
import csv

# this opens the .csv file and reads it into the variable 'spread'
spread = csv.reader(open("SPECIES.csv","rb"))
#this is used to display the contents of spread
print spread
#this function asigns numbers to the feild headings in the database
for i,heading in enumerate(spread.next()):
    print i,heading
# the following splits up 'spread' and adds it to the database and saves them under the headings theyre given 


for c, row in enumerate(spread):
    #Checking that there is EDGE data on the animal   
    if c > 1:
            
        if (len(row[6]) > 1) and (row[6] != "NULL"):
            #Checking there is common name data on animal
            if (len(row[12]) > 1) and (row[12] != "NULL"):
                #Checking there is a description of the animal
                if (len(row[16]) > 1) and (row[16] != "NULL"):
                    #Therefore add common name of animal to array

                    #@Nour: here you can put your code to add to the database
                    #All the stuff about AnimalNames and numAnimals can  be ignored
                     
                    

                      
                    animal= Animal()
                    animal.species_ID= row[0]
                    animal.status= row[1]
                    animal.create_time= row[2]
                    animal.modify_time= row[3]
                    animal.EDGE_group= row[4]
                    animal.Type= row[5]
                    animal.EDGE_rank= row[6]
                    animal.species_class= row[7]
                    animal.species_order= row[8]
                    animal.species_family= row[9]   
                    animal.scientific_name= row[10]
                    animal.synonym= row[11]
                    animal.common_names= row[12]
                    animal.ED_score= row[13]
                    animal.ge_score= row[14]
                    animal.EDGE_score= row[15]
                    animal.summary= row[16]
                    animal.short_summary= row[17]
                    animal.other_names= row[18]
                    animal.edgeometer= row[19]
                    animal.possibly_extinct= row[20]
                    animal.focus_species= row[21]
                    animal.search_countries= row[22]  
                    animal.country_found_in= row[23]
                    animal.aquuatic_regions= row[24]
                    # the if statement is used to check the boolean statement and act accordingly  
                    if row[20] == "Y":
                        animal.extinct= True
                    if row[20] == "N":
                        animal.extinct= False
                    # this is used when it has an error with the data type that the records are saved in, it should ignore the error
                    try:
                        animal.save()
                    except ValueError: continue 




 

  

