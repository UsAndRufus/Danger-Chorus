from django.db import models

# here is where i assigned data types to the 

class Animal(models.Model):
   
    species_ID = models.FloatField() 
    status= models.TextField()
    create_time= models.TextField()
    modify_time= models.TextField()
    EDGE_group= models.TextField()
    Type= models.TextField()
    EDGE_rank= models.FloatField()
    species_class= models.TextField()
    species_order= models.TextField()   
    species_family= models.TextField()
    scientific_name = models.TextField()
    synonym= models.TextField()
    common_names = models.TextField()
    ED_score= models.FloatField()
    ge_score =models.CharField(max_length=2)
    EDGE_score= models.TextField()
    summary= models.TextField()
    short_summary= models.TextField()
    other_names =models.TextField()
    edgeometer= models.TextField()
    extinct =models.BooleanField()
    focus_species= models.TextField()
    search_countries= models.TextField()
    country_found_in =models.TextField()
    aquatic_regions= models.TextField()
    
    def __str__(self):
        return self.common_names
        
        
