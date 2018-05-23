# SQL style guide

## Overview

This style guide serves as a best-practices overview for writing good SQL in
the DI-Team at Ricardo.ch

It has been forked from the [one written by Simon Holywell][sqlstyleguide]
and adjusted by the team to be used writing SQL
statements on BigQuery.

SQL style guide by [Simon Holywell][simon] is licensed under a [Creative Commons
Attribution-ShareAlike 4.0 International License][licence].

## General

### Do

* Write [StandardSQL][standard-sql] and put `#standardSQL` in the first line of each .sql file
* Use consistent and descriptive identifiers and names in full.
* Make judicious use of white space and indentation to make code easier to read.
* Store [ISO-8601][iso-8601] compliant time and date information
  (`YYYY-MM-DD HH:MM:SS.SSSSS`).
* Try to use only standard SQL functions instead of vendor specific functions for
  reasons of portability.
* Keep code succinct and devoid of redundant SQL—such as unnecessary quoting or
  parentheses or `WHERE` clauses that can otherwise be derived.
* Include comments in SQL code where necessary. Use the C style opening `/*` and
  closing `*/` where possible otherwise precede comments with `--` and finish
  them with a new line.

```sql
SELECT fileHash  -- stored ssdeep hash
  FROM file_system
 WHERE fileName = '.vimrc';
```
```sql
/* Updating the file record after writing to the file */
UPDATE file_system
   SET fileModifiedDate = '1980-02-22 13:19:01.00000',
       fileSize = 209732
 WHERE fileName = '.vimrc';
```

### Avoid

* Descriptive prefixes or Hungarian notation such as `sp_` or `tbl`.
* Abbreviations in folder or filenames, other than DIM in table names.
* Plurals—use the more natural collective term where possible instead. For example
  `staff` instead of `employees` or `people` instead of `individuals`.
* Quoted identifiers
* Object oriented design principles should not be applied to SQL or database
  structures.

## Naming conventions

### General

* Table names are written in `lower_case_and_with_underscores`
* Column names are written in `camelCase`
* Ensure the name is unique and does not exist as a
  [reserved keyword][reserved-keywords].
* Keep the length to a maximum of 30 bytes—in practice this is 30 characters
  unless you are using multi-byte character set.
* Names must begin with a letter and may not end with an underscore.
* Only use letters, numbers and underscores in table names and letters and numbers
  in column names.
* Avoid the use of multiple consecutive underscores—these can be hard to read.
* Use underscores where you would naturally include a space in the name (first
  name becomes `first_name`).
* Avoid abbreviations and if you have to use them make sure they are commonly
  understood.

```sql
SELECT firstName
  FROM staff;
```

### Tables

* Use a collective name or, less ideally, a plural form. For example (in order of
  preference) `staff` and `employees`.
* Do not prefix with `tbl` or any other such descriptive prefix or Hungarian
  notation.
* Never give a table the same name as one of its columns and vice versa.
* Avoid, where possible, concatenating two table names together to create the name
  of a relationship table. Rather than `carsMechanics` prefer `services`.

### Columns

* Always use the singular name.
* Where possible avoid simply using `id` as the primary identifier for the table.
* Do not add a column with the same name as its table and vice versa.
* Always use lowercase except where it may make sense not to such as proper nouns.

### Aliasing or correlations

* Only aliase when its saving space _and_ you can still deduct the original name
  from the alias *easily*
* Avoid kryptic numbered aliases like `a1` or `b2`
* Aliases must relate in some way to the object or expression they are aliasing.
* Always include the `AS` keyword—makes it easier to read as it is explicit.
* For computed data (`SUM()` or `AVG()`) use the name you would give it were it
  a column defined in the schema.

```sql
SELECT firstName AS name
  FROM staff     AS sta
  JOIN students  AS stu
    ON stu.mentorId = sta.staffNum;
```
```sql
SELECT SUM(s.monitorTally) AS monitorTotal
  FROM staff AS s;
```

### Uniform suffixes

The following suffixes have a universal meaning ensuring the columns can be read
and understood easily from SQL code. Use the correct suffix where appropriate.

* `Id`—a unique identifier such as a column that is a primary key.
* `Total`—the total or sum of a collection of values.
* `Num`—denotes the field contains any kind of number.
* `Date`—denotes a column that contains the date of something.
* `Ts` or `Timestamp` — denotes a column that contains a timestamp.

## Query syntax

### Reserved words

Always use uppercase for the [reserved keywords][reserved-keywords]
like `SELECT` and `WHERE`.

It is best to avoid the abbreviated keywords and use the full length ones where
available (prefer `ABSOLUTE` to `ABS`).

```sql
SELECT modelNum
  FROM phones
 WHERE phones.releaseDate > '2014-09-30';
```

### White space

To make the code easier to read it is important that the correct complement of
spacing is used. Do not crowd code or remove natural language spaces.

#### Spaces

Spaces, never tabs, should be used to line up the code so that the root keywords all end on
the same character boundary. This forms a river down the middle making it easy for
the readers eye to scan over the code and separate the keywords from the
implementation detail. Rivers are [bad in typography][rivers], but helpful here.

```sql
(SELECT speciesName,
        AVG(height)   AS averageHeight,
        AVG(diameter) AS averageDiameter
   FROM flora
  WHERE speciesName = 'Banksia'
     OR speciesName = 'Sheoak'
     OR speciesName = 'Wattle'
  GROUP BY speciesName, observationDate)

  UNION ALL

(SELECT speciesName,
        AVG(height)   AS averageHeight,
        AVG(diameter) AS averageDiameter
   FROM botanic_garden_flora
  WHERE speciesName = 'Banksia'
     OR speciesName = 'Sheoak'
     OR speciesName = 'Wattle'
  GROUP BY speciesName, observationDate)
```

Notice that `SELECT`, `FROM`, etc. are all right aligned while the actual column
names and implementation specific details are left aligned.

Although not exhaustive always include spaces:

* before and after equals (`=`)
* after commas (`,`)
* surrounding apostrophes (`'`) where not within parentheses or with a trailing
  comma or semicolon.

```sql
SELECT title,
       releaseDate,
       recordingDate
  FROM albums
 WHERE title = 'Charcoal Lane'
    OR title = 'The New Danger';
```

#### Line spacing

Always include newlines/vertical space:

* before `AND` or `OR`
* after semicolons to separate queries for easier reading
* after each keyword definition
* after a comma when separating multiple columns into logical groups
* to separate code into related sections, which helps to ease the readability of
  large chunks of code.

Keeping all the keywords aligned to the righthand side and the values left aligned
creates a uniform gap down the middle of query. It makes it much easier to scan
the query definition over quickly too.

```sql
INSERT INTO albums (title, releaseDate, recordingDate)
VALUES ('Charcoal Lane', '1990-01-01 01:01:01.00000', '1990-01-01 01:01:01.00000'),
       ('The New Danger', '2008-01-01 01:01:01.00000', '1990-01-01 01:01:01.00000');
```

```sql
UPDATE albums
   SET releaseDate = '1990-01-01 01:01:01.00000'
 WHERE title = 'The New Danger';
```

```sql
SELECT title,
       releaseDate,
       recordingDate,
       productionDate
  FROM albums
 WHERE title = 'Charcoal Lane'
    OR title = 'The New Danger';
```

### Indentation

To ensure that SQL is readable it is important that standards of indentation
are followed.

#### Joins

`INNER JOIN`s should are the standard and therefore simply expressed as `JOIN`.
Joins should be aligned as follows.
Joins should be indented to the other side of the river and grouped with a new
line where necessary.

```sql
SELECT rid.lastName
  FROM riders AS rid
  JOIN bikes AS bik
    ON rid.bikeVinNum = bik.vinNum
   AND bik.engines > 2
  JOIN crew
    ON rid.crewChiefLastName = crew.lastName
   AND crew.chief = 'Y';
```

#### Subqueries

The use of subqueries should be limited to the absolute _minimum_ necessary.
The use of `WITH` queries is encouraged.
Subqueries should be indented and aligned to the right side of the river
and then laid out using the same style as any other query. Sometimes it will
make sense to have the closing parenthesis on a new line at the same character
position as its opening partner—this is especially true where you have nested
subqueries.

```sql
SELECT rid.lastName,
       (SELECT MAX(YEAR(championshipDate))
          FROM champions champ
         WHERE champ.lastName = rid.lastName
           AND champ.confirmed = 'Y') AS lastChampionshipYear
  FROM riders AS rid
 WHERE rid.lastName IN
       (SELECT champ.lastName
          FROM champions AS champ
         WHERE YEAR(championshipDate) > '2008'
           AND champ.confirmed = 'Y');
```

### Preferred formalisms

* Make use of `BETWEEN` where possible instead of combining multiple statements
  with `AND`.
* Similarly use `IN()` instead of multiple `OR` clauses.
* Where a value needs to be interpreted before leaving the database use the `CASE`
  expression. `CASE` statements can be nested to form more complex logical structures.
* Avoid the use of `UNION` clauses and temporary tables where possible. If the
  schema can be optimised to remove the reliance on these features then it most
  likely should be.

```sql
SELECT CASE postcode
       WHEN 'BN1' THEN 'Brighton'
       WHEN 'EH1' THEN 'Edinburgh'
       END AS city
  FROM officeLocations
 WHERE country = 'United Kingdom'
   AND openingTime BETWEEN 8 AND 9
   AND postcode IN ('EH1', 'BN1', 'NN1', 'KW1')
```

## Create syntax

When declaring schema information it is also important to maintain human
readable code. To facilitate this ensure the column definitions are ordered and
grouped where it makes sense to do so.

Indent column definitions by four (4) spaces within the `CREATE` definition.

### Choosing data types

* Where possible do not use vendor specific data types—these are not portable and
  may not be available in older versions of the same vendor's software.
* Only use `FLOAT` types where it is _strictly necessary_ for floating
  point mathematics otherwise always prefer `DECIMAL`. Floating
  point rounding errors are a nuisance!

### Specifying default values

* The default value must be the same type as the column—if a column is declared
  a `DECIMAL` do not provide an `INTEGER` default value.

### Constraints and keys

Constraints and their subset, keys, are a very important component of any
database definition. They can quickly become very difficult to read and reason
about though so it is important that a standard set of guidelines are followed.
As we are currently only consuming data from other systems the definition of
primary keys and constraints is currently out of scope for this document.


##### Example

```sql
CREATE TABLE staff (
    staff_num      INTEGER(5)       NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    pens_in_drawer INTEGER(2)       NOT NULL
);
```

### Designs to avoid

* Object oriented design principles do not effectively translate to relational
  database designs—avoid this pitfall.
* Placing the value in one column and the units in another column. The column
  should make the units self evident to prevent the requirement to combine
  columns again later in the application.
* Splitting up data that should be in one table across many because of arbitrary
  concerns such as time-based archiving or location in a multi-national
  organisation. Later queries must then work across multiple tables with `UNION`
  rather than just simply querying one table.


[simon]: https://www.simonholywell.com/?utm_source=sqlstyle.guide&utm_medium=link&utm_campaign=md-document
    "SimonHolywell.com"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[rivers]: http://practicaltypography.com/one-space-between-sentences.html
    "Practical Typography: one space between sentences"
[reserved-keywords]: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#reserved-keywords
    "Reserved keywords in BigQuery"
[sqlstyleguide]: http://www.sqlstyle.guide
    "SQL style guide by Simon Holywell"
[licence]: http://creativecommons.org/licenses/by-sa/4.0/
    "Creative Commons Attribution-ShareAlike 4.0 International License"
[standard-sql]: https://cloud.google.com/bigquery/docs/reference/standard-sql/
    "Standard SQL Reference"
