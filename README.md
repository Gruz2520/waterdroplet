## Intro
‘Waterdroplet’ allows residents of homes using ‘Waterdroplet’ services to take meter readings via photo and instantly receive a bill to pay for water service. There is a need for staff willing to verify true meter readings. This need has arisen when there is a questionable/unlogical change in meter readings relative to old readings. Such verification is provided by the ‘Waterdroplet’.

## Realisation

A microservice architecture with load balancer and resource quantity modification was developed. 

A cross-platform application with the ability to exchange information with the server side.

A YOLO-like model for determining meter readings from a photograph regardless of lighting or other complicating factors. The architecture has been refined by increasing drop-out layer metrics, adjusting convolutions, and increasing fully-connected layers.

### Rep:
- [api_ml](api_ml) folder with an implementation of a simple API for accessing the model and the model itself
- [backend](backend) folder with a full implementation of a unified backend for both the site and cross-platform application
- [frontend](frontend) full frontend for the site 
- [mobile_dart_app](mobile_dart_app) implementation of cross-platform app for photos and communication with the model
