# DataBase

## Enums

### MediaType
- movie
- serie

### Rating
- 0
- 1
- 2
- 3
- 4
- 5

### Role
- admin
- user

## Entities

### Categories
| Fields | Type    |
| ------ | ------- |
| Name   | String* |

### Media
| Field        | Type            |
| ------------ | --------------- |
| Type         | Enum[MediaType] |
| Title        | String*         |
| Description  | String          |
| Poster       | Array[images]*  |
| File_Path    | String*         |
| Languages    | Array[String]   |
| Subtitles    | Array[Subtitle] |
| Duration     | Time*           |
| Categories   | Array[String]   |
| Rating       | Calc(User Rates)|

#### Movie
| Field        | Type         |
| ------------ | -------------|
| Sequence     | Array[Movie] |

#### Serie
| Field   | Type     |
| ------- | -------- |
| Season  | Integer* |
| Episode | Integer* |

### Users

| Field             | Type          |
| ----------------- | ----          |
| Name              | String*       |
| Email             | String*       |
| Password          | String*       |
| Prefered_Language | String        |
| Use_Subtitle      | Boolean       |
| Role              | Enum[Role]    |
| Breakpoints       | Array[Breakpoints] |
| Playlist          | Array[MediaID]|
| Ratings           | Array[Rating] |
| Watched           | Array[MediaID]|

### Breakpoint (Embedded)
| Fields   | Type         |
| -------- | ------------ |
| MediaID  | String       |
| Time     | Time         |

### Rating (Embedded)
| Fields   | Type         |
| -------- | ------------ |
| MediaID  | String       |
| Rate     | Enum[Rating] |

### Subtitle (Embedded)
| Fields    | Type         |
| --------- | ------------ |
| File_Path | String       |
| Language  | String       |