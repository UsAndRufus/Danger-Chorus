import csv
spread = csv.reader(open("SPECIES.csv","rb"))
print spread

AnimalNames = []
AnimalGE = []
Types = {}
Species_Order = {}

numAnimals = 0
GE_found = True

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
                    AnimalNames.append(row[12])
                     
                    
                    numAnimals = numAnimals + 1


AnimalNames.sort(key = str.lower)


print("Species class:")
print Types
print Species_Order

for current in AnimalNames:
    pass
    #print current


print numAnimals
#print("Done.")
