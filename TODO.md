1. Prepare models to create a show
2. Prepare all working APIs for all these entities
3.
4. Prepare Header by adding logo, link to Home page, User profile, Region
5. Fetch regions and set cookie for selected region, that can be used for future API calls.
6. Design pages
-> create testcases to test APIs
-> Use Swagger or other lib for API documentation
-> Send Verification email on registration
-> Verify User email / Phone via OTP
-> Show the various seating layout while booking and add screen (Seating arrengment)

MVP: Cover 1 full use case

API: List out movies released recently
OR
API: List out movies has scheduled shows

On Movie Detail page add Booking button (Book a show)

On Booking page: 
- List out all the theaters and their shows for selected movie and Today(Date)
(shows by movieId and Date, order theater, time)
- Seat Selection (Get details of show by showId)
- Once Seat are selected take user to payment page

On Payment page show the complete details about Booking and Bill breakup

On successful payment confirm a Booking and give Booking ID

-> Partner
Show / Update Theater profile
Add new show
Get the Booking information for a show.