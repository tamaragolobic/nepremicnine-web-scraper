CREATE TABLE User
(
    UserID    INT PRIMARY KEY AUTO_INCREMENT,
    Username  VARCHAR(20) UNIQUE,
    Name      TEXT,
    Password  TEXT,
    Email     VARCHAR(50),
    IsDeleted TINYINT(1) DEFAULT 0
);

CREATE TABLE ParseUrl
(
    ParseUrlID INT PRIMARY KEY AUTO_INCREMENT,
    Url        TEXT,
    UserID     INT,
    FOREIGN KEY (UserID) REFERENCES User (UserID)
);

CREATE TABLE Ads
(
    ID         INT PRIMARY KEY AUTO_INCREMENT,
    Title      TEXT,
    Price      INT,
    ParseDate  DATETIME DEFAULT NOW(),
    Url        TEXT,
    ParseUrlID INT,
    FOREIGN KEY (ParseUrlID) REFERENCES ParseUrl (ParseUrlID)
);