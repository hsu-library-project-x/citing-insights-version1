# Citing Insights API Documentation

Each collection in the database has the same configuration of end points that can be reached.

For the following, <collection> can be any of the following: 
users, courses, assignments, papers, citations
  
## EndPoints


#### List --  GET Request


`/<collection>/`

Queries the database for the entire collection, and returns JSON


#### Show -- GET Request

`/<collection>/:id`

Queries the database for a specific document in a collection, where
:id references the ObjectId for the given document. Returns document in JSON.


#### Create -- POST Request

`/<collection>/`

Creates a new document in the given collection. 


#### Update -- PUT Request

`/<collection>/:id`

Updates the document that :id references for the desired collection. 


#### Remove -- DELETE Request

`/<collection>/:id`

Deletes the document from the given collection that corresponds the 
:id sent with the DELETE request


## *Examples*

* /api/papers/

  * If sent a GET request, this will show all documents in the paper collection.
 * If sent a POST request, this will create a document in papers, with information sent along with the request.

* /api/papers/5d0aab0cf43d790f49ed2b6b

 * If sent a GET request, this URL will show the contents of the paper with the corresponding 
id: 5d0aab0cf43d790f49ed2b6b.

 * If sent a DELETE request, this will delete that corresponding document.
