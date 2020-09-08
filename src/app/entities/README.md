## Entities module

This is an angular module which is intended to be used as a resource repository and a place to keep data
associated with Domain models such as information about fields and validation constraints in order to not repeat
code and strings all over what is a large codebase.

### Resource Folders

There are sub folder for domain models which have the same data and files names.

* constants.ts - a place to declare constants such as field names which should be used to reduce issues with maintenance when/if model field names are changed or removed
* constraints.ts - an array of constraints in format of constrains in the library validation.js.   There are some common constraints which can be imported declared in the common-constraints file.
* fields.ts - A list of field information for a model containing descriptions of how fields can be used/displayed in forms or tables.
* interface.ts - A TypeScript interface describing the model.  This should be used also to make maintenance easier and provide type help when developing functionality which uses this particular domain model.
* index.ts - Should export an injectable resource service.  The aim of this was to reproduce the functionalty of angular.js $resource but uses Decorators to declare
 information such as url.  A function makeResource service is used to generate a class which will make requests, interpolate urls, handle errors and emit requests to display notification when errors occur.  Additional request methods can be added which need to be decorated with ActionUri & Action decorators.


### Resource Services

Use of resource services will reduce duplication of functionality.  Each resource service will by default contain
* A query method to search for a list of the resource in question
* A find method to find an individual resource
* A delete method to delete an individual resource
* An upated method to upate an individual resource
* Emit user notification message events when a request succeeds or fails.
* The ability to swicth to Mock endpoints using the Mock decorator
* Attached metadata which can be used

In order to create a resource service a class will need to be declared which extends the Resource class found in the framework folder.

Then to create the service with

## Request methods
For each class which extends the Resource class found in the framework folder.  A default number of resource requests will be hooked into
the created service.

## Queries
Queries will be built automatically by providing a pagination params & a filters object as arguments for requests which matches the interface IFilters interface found in the entities.types file.  This is so that the compiler can help if there is a change to the format server queries.  If queries are built just using
strings at individual call sites there would be no sensible way to find & update all places which changes may need to be made and would leave more
room for error in the requests.