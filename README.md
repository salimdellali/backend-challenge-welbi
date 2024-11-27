# Welbi Backend Challenge

create a recommendation engine using a provided dataset.

link to the challenge details: [welbi.org](https://welbi.org)

## Live demo

at the link: [https://backend-challenge-welbi.vercel.app](https://backend-challenge-welbi.vercel.app)

you can even try GET requests from the live demo

## Endpoints

- GET `/api/recommend/interesting-program-names?residentname=<your_resident_name>`: Something that <your_resident_name> would like
- GET `api/recommend/most-popular-program-names`: Engages the highest number of residents
- GET `api/recommend/engages-isolated-residents-program-names`: Engages multiple isolated residents (those who have not been to a program recently)
- GET `api/recommend/address-offerings-gap-program-names`: Addresses a gap in offerings (lots of interest from residents, but no similar programs planned)
- GET `api/recommend/address-time-gap-program-names`: Addresses a gap in time (a reasonable day and time with few programs offered

## Scripts

- `npm run dev`: run the project in dev mode
- `npm run build`: build project to production ready,
- `npm run start`: launch build
- `npm run lint`: apply linting to the whole project
- `npm run test`: run overview tests
- `npm run test:verbose`: run tests and see details of each test run

## Steps I took to solve the challenge

1. read the email and understand clearly what needs to be done
1. read the [welbi.org](https://welbi.org) challenge details
1. choose the backend path
1. take a look at the dataset
1. put on a coding playlist
1. dissect the dataset
1. choose Next.js as technology, in order to easily create the frontend for the backend (if time allows it)
1. create the Resident and Program types
1. create a simple endpoint to test if things are working correctly
1. setup dataset locally and ensure data fetching is working
1. implement feature 1 "Something that Darla Blanda would like"
1. define DTOs and Next responses shapes
1. implement feature 3 "Engages the highest number of residents"
1. implement feature 4 "Addresses a gap in offerings"
1. implement feature 5 "Addresses a gap in time"
1. implement feature 2 "Engages multiple isolated residents"
1. refactor code
1. prepare simple home page with links to test the REST API endpoints in the browser
1. add unit tests, add test and test:verbose scripts, add author to package.json, add TODO unit and integration tests, fix a bug in countDaysBetweenISODateTimesUTC(), edit home page metadata
1. sonarlint: address sonarlint warnings that I have missed for some reason, use toSorted() instead of sorted because sorted() mutates the array, fix duplicate imports, remove unecessary exclamation marks
1. extract shared types into their own types file
1. edit README.md

## What's left TODO

- in GET `/api/recommend/interesting-program-names?residentname=<your_resident_name>` :
  - get the resident name using dynamic route handler instead of query params for better URL aesthetics
  - if resident has no hobbies, recommend 3 random programs (who knows maybe the resident might like those)
  - randomize recommended programs with same similarity score hobbies
- make `NUMBER_OF_TOP_HOBBIES`, `NUMBER_OF_LEAST_PACKED_DAYS`, and `NUMBER_OF_ISOLATION_DAYS` configurable (as env vars?)
- handle file not found error edge case when reading the dataset file
- find a better place to store DTOs and custom Next Success & Error responses
- add tests for repositories and services

## Lessons learned

- sort() mutates the array it is applied to, had to replace it with toSorted()
- literally applied the concept of **"make it work, make it right, make it fast"**. So I made it work first, then made it right (refactoring). Did not make it fast (yet)

## Final notes

- I liked so much solving these types of "puzzle" challenges
- built with love and excitement by Salim Dellali =)
