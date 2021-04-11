# StockNow
StockNow is a web application that allows the user to view realtime stock charts and manage their own list of stocks to watch.
- **URL:** https://stocknow.herokuapp.com/
- **VIDEO URL:** https://www.youtube.com/watch?v=-CLEj3IpOfU&ab_channel=JimmyY
- **REFERENCES ARE INCLUDED AT THE TOP OF FILES WHERE APPLICABLE**

## Team Members

### Howard Leung `howardd.leung@mail.utoronto.ca`
I am a 3rd year student studying Computer Science at UTSC. I have previous experience developing web applications from CSCC01 where I created a react web application from scratch and also my previous internship where I worked with an Angular web application and a C# REST API. I hope to strengthen my UI building through this project.

### Jimmy Yu `jimmmy.yu@mail.utoronto.ca`
I'm currently a 3rd year Computer Science student, specializing in software engineering at UTSC. I was able to experience working on a web application in C01, that utilised the MERN stack, where I only primarily worked on the backend. So I'm excited to have the opportunity to learn more technologies through this project.

## Beta Features

 - **User account creation:** Allow users to create and sign-in to an account
 - **Search up stock by their symbol:** Allow users to search for a stock using the stock's symbol
 - **Create and manage watchlist:** Allow users to add or remove stocks from their watchlist
 - **View details of a chosen stock:** Show stock data such as current market price, previous close, todays open, market cap

## Final Features

- **Chart view:** Allow users to view stock data as a chart, showing data from the past day, 5 days, 1 month, 5 months, 1 year, etc.
 - **Web Notifications:** Allow users to set notifications for if a stock reaches a price threshold
 - **QR Code:** Allow users to share their watchlists through a QR code
 - **News section:** Allow users to view recent news surrounding the market
 - **2 factor authentication:** Require users to enter a code in addition to their passowrd to login

## Technologies

 - React
 - Express
 - GraphQL
 - NodeJS
 - MongoDB
 - Yfinnance API
 - Native web APIs
	 - Push notifications
 -	Google Authenticator
 -	QR codes

## Top 5 Technical Challenges

 - **View stocks as a chart with past data:** Although it is simple to get the current price and data for a stock given its symbol. It is difficult to format this data as a chart and display it to the user allowing them to choose the performance of a stock given a specific amount time.
 - **2 factor authentication:** Since this will be dealt with externally from our application, it will be hard to control and manage the authentication and length of validity of a code.
 - **QR codes:** We will have to create and manage QR codes within our application. This means we have to decide what happens when a user scans a QR code, decide how we are going to generate these codes, and how they will be stored.
 - **Live stock data:** In order to provide users with live data of the stock market, we will have to come up with a better solution than a simple loop such as the `setTimeout` one seen in class.
 - **Keeping news relevant:** It is important that when we include news in the news section, the article is relevant to the stock market in some way. The challenge is how we are going to filter through news and include only those that our users would be interested in.
