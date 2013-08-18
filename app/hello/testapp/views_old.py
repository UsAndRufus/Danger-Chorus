from django.http import HttpResponse
from hello.testapp.models import * 
from django.template import Context, Template
import urllib2 
from xml.etree.ElementTree import ElementTree, tostring 
import urllib
import json

#this part is used to extract the common name of every animal(from the database)and split it onto new lines 

def api(request,pk):
    animal= Animal.objects.get(pk=pk)
    animal_dict = animal.__dict__
    del animal_dict["_state"]
    return HttpResponse(json.dumps(animal_dict),content_type='application/json')
  
#this part is used in styling the web page and the text [using html and css](body colour, background image,the heading,the scroll function and a link to the style.css file where the css code is written in)      
def home(request):
   t = Template("""
   
<head>
    <link rel="stylesheet" type="text/css" href="/static/style.css" />
    <!-- Scripts -->
    <script src="/static/oampo-Audiolet-631198c/src/audiolet/Audiolet.min.js"></script>
    <script src = "/static/jquery.min.js"></script>
    <script src="/static/audiolet_app.js"></script>
</head>

   
 <body>
    <div id = 'notepad'>
    <div id = 'heading'>
<h1 class="Courier New" {padding-right: auto; padding-left:auto;}>Danger Chorus</h1>
    </div>
    <div id = 'text'>
   <ul class="a">
   {% for animal in animals %}
    <li>
       <span onClick = 'JSON({{animal.id}})' style='{cursor:pointer}'>
        {{ animal.common_names }}
       </span>
    </li>

   {% endfor %}
     </ul>
    </div>
   <div id = 'listen'>
        <section id="play">
            <div class = 'button'>
                <input type = 'radio' name = 'select' value = '1'>
                <button type="button" onclick="playAnimal1()">&#9654; Play Animal 1</button>
                </br>
            </div>
            <div class = 'button'>
                <input type = 'radio' name = 'select' value = '2'>
                <button type="button" onclick="playAnimal2()">&#9654; Play Animal 2</button>
                </br>
            </div>
            <div class = 'button'>
                <input type = 'radio' name = 'select' value = '3'>
                <button type="button" onclick="playAnimal3()">&#9654; Play Animal 3</button>
                </br>
            </div>
            <input type = 'radio' name = 'select' value = '4' id ='select'> None
            </br>
            </br>
            <button type = 'button' onClick="clearAnimals()">Clear all animals</button
        </section>
   </div>
   </div>
   </body>
   
   
   
   
      """)
   
  # The following code is used to put the 'common names'taken from the database into alphabetical order and then display the animal names into the web app  
   animals= Animal.objects.order_by("common_names")
   c = Context({"animals": animals})
 
   print animals
   return HttpResponse(t.render(c))

# the following section is used to give the animal list a hyperlink each that will direct the user to the information exclusive to the selected animal 
#for each item of information about an animal its given a heading to explain each section- its given a different font and colour so that its easier to distinguish.
#it also sets the layout and colour for the display page   

def animal(request,pk):   
   t = Template("""
  <head>
<link rel="stylesheet" type="text/css" href="/static/style.css" />
</head>

   <div id= 'notepad'>
   

<div id= 'content'>

    <div id= 'text'>
      <h3>Animal's common name:</h3>
<p class="sansseriff"><div>{{ animal.common_names }}</div></p>
    
    <h3>Species ID:</h3>
<p class="sansseriff"><div>{{ animal.species_ID }}</div></p>
  
    <h3>Animal's scientific name:</h3>
<p class="sansseriff"><div>{{ animal.scientific_name }}</div></p>
  
    <h3>Animal's other names:</h3>
{% if not animal.other_names %}-{% endif %}
<p class="sansseriff"><div>{{ animal.other_names }}</div></p>
  
    <h3>Summary of the animal:</h3>
{% if not animal.summary %}-{% endif %}
<p class="sansseriff"><div>{{ animal.summary }}</div></p>
  
    <h3>Animal's GE score:</h3>
<p class="sansseriff"><div>{{ animal.ge_score }}</div></p>


    <h3>Possibly exinct?:</h3>
<p class="sansseriff"><div>{{ animal.extinct }}</div></p>
  
    <h3>Animal's origin country:</h3>
{% if not animal.country_found_in %}-{% endif %}
<p class="sansseriff"><div>{{ animal.country_found_in }}</div></p>
</div><!--text-->
<div id= 'funstuff'>
<img src="{{image}}" />
      
{% if not animal.country_found_in %} 
   {% else %}
   <iframe id= 'map' width="400" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=uk&amp;aq=&amp;ie=UTF8&amp;hq=&amp;hnear={{location}}&amp;t=m&amp;z=5&amp;output=embed"></iframe>
{% endif %}

<img src="/static/status.png" class= 'status'/>
</div><!--endfun -->
</div><!--content-->
</div><!--notepad-->

   """)
   
   animal= Animal.objects.get(pk=pk)
   
   # this part is used to carry out a search of the animal thats being selected by the user using the search results from wikimedia 
   url= urllib2.urlopen('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=%22'+ urllib.quote_plus(animal.common_names ) +'%22&gsrlimit=1&prop=imageinfo&iiprop=url&format=xml' )
   
   tree = ElementTree()
   
   tree.parse(url)
   
   print tostring(tree.getroot())
   # this tells 
   try:
    images= tree.find('query').find('pages').find('page').find('imageinfo').find('ii').attrib['url']
   except AttributeError:  
    images= ""
   # this is the variable thats used to store the country an animal is originally found in which is then used to find a location in which the animal was originally found in using an embedded google maps image 
   location= urllib.quote_plus(animal.country_found_in ) 

   c = Context({"animal": animal, "image": images, "location": location})
   
   # this is used to display the image of the animal thats found onto the page 
 
   print images 

   return HttpResponse(t.render(c))
