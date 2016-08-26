# Time

Any recurring event can let you track time. For instance, if your cat leaves the house regularly, just count each event. However, time tracking is best served with those three Rules of Timekeeping™:

- It must be **easy to track**,
- have a **constant frequency** so that we can assign fixed durations to certain actions, say baking a cake,
- be **small**, so that we can track extremely short events: counting multiples is easier than divisions.

## Day

The easiest event to track is the presence of the sun in the sky. The **day** was obviously the first time unit in use. For shorter events, it was subdivided into 24 hours, each with 60 minutes that have 60 seconds. (That strange system is probably the oldest legacy code in existence.)

Initially, hours were scheduled so that there were 12 hours between the start and end of the night, but this design broke rule 2 everywhere but at the equator, and so it was evolved into uniform subdivisions of the whole day.

Nowadays, **UT1** best tracks that definition of days. Through complex measurements involving the tracking of galaxies in the sky, the angle between the centre of the sun and latitude 0 (passing through Greenwich, UK) is mapped to a precise time. However, various events on Earth like tsunamis accelerate or slow down the Earth's rotation, making this measure break rule 2 as well. Worse yet, because of the Moon's attraction, the Earth's rotation is perpetually going to slow down, increasing the length of days increasingly fast.

## Year

With agriculture, it became necessary to track a different recurring cosmic event: the number of turns of the Earth around the Sun. We know it as a **year**. Of course, there is not an integer number of days in a year; there are around 365.24219 Earth rotations in an Earth revolution.

Yet again, this measure breaks rule 2, even though it is not as bad. A large number of gravitational effects from the other planets modify the length of a sideral year in ways that seem random to the untrained eye.

## Second

Initially, the **second** was backed by the day, as we mentionned. Then, it was backed by the moon. Then the metre (for use in mechanical clocks). Then the year. Finally, technology allowed us to realize that microwaving cesium makes its electrons oscillate at a very nearly constant frequency. It is the best timekeeper we have, and fortunately we can still use it if we change solar system.

So we switched to defining the second as a multiple of those oscillations. When the switch was made, the second was exactly equal to a second as defined previously (a portion of a year). Now, the most precise way to measure time is to count the number of seconds, which is convenient, since the second is the SI unit of time.

As a result, **TAI** (for International Atomic Time) was designed to count all time units in terms of atomic clocks at sea level. A TAI day is 24×60×60 seconds, a year is 365 days except on leap years, where it is 366 days. Leap days are used to correct the 0.24219 extra days in a year (imperfectly; they only correct 0.2425). They add a day at the end of February. They occur on years divisible by 4 and not divisible by 100, except if divisible by 400.

![TAI](http://www.bipm.org/utils/common/img/tai/timelinks-2013.jpg)
*Location of laboratories contributing to computing TAI.*

But of course, as days increase because of the Moon's gravitational pull, days no longer last 24×60×60 seconds — they are a minuscule bit longer than that. Today, TAI's midnight is roughly 40 seconds after the UT1 midnight.

To allow computing civil time accurately forever while benefitting from TAI's conformance to the Rules of Timekeeping™, a mix was made, called **UTC**. UTC is just like TAI, except that it is a fixed number of seconds before it. Every once in a while, the [IERS](https://www.iers.org/IERS/EN/Home/home_node.html) (International Earth Rotation and Reference Systems Service) proclaims that there will be a leap second added at the end of a certain day, causing the time to go from 23:59:59 to 23:59:60 (← leap second!) and then 00:00:00. The IERS does this every time it sees that there is a risk for UTC to deviate from UT1 by more than one second.

That said, realistically, if in 30 000 years midnight has slowly become the rough time when the sun rises, the Earth population will have had time to change the meaning of the word. As a result, there is a possibility (that computer scientists warmly welcome) that UTC stop adding leap seconds after a certain year.

There is another widely used second-based code representing instants in time: **[Unix time][]**. It is the number of seconds since the start of year 1970, *not including leap seconds*. Unix time allows sub-second precision (using a real number instead of integers). Since leap seconds are discarded, they need to be subtracted. As a result, when a leap second occurs, Unix time is determined by the [POSIX][] standard to increase linearly by one second for that second, and then jump back by one second, and again increase linearly by one second, making that second happen twice.

That design ensures that we can easily compute the number of UTC days between two Unix time stamps. However, it does not give the correct number of SI seconds. To quote [them][Unix time rationale]:

> [M]ost systems are probably not synchronized to any standard time reference. Therefore, it is inappropriate to require that a time represented as seconds since the Epoch precisely represent the number of seconds between the referenced time and the Epoch.

[Unix time]: http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15
[POSIX]: http://standards.ieee.org/develop/wg/POSIX.html
[Unix time rationale]: http://pubs.opengroup.org/onlinepubs/9699919799/xrat/V4_xbd_chap04.html#tag_21_04_15

As a result, in order to compute the number of seconds between two times, if they are TAI times: convert them to seconds and subtract them. If they are UTC or Unix time: do the same, then account for all leap seconds that occurred between them.

## Time Zones

Here is a more difficult question to answer: “What time is it here?” Civil time is one of those things that governments impose by law. Therefore, answering that question involves language, politics and alarms.

To give the same meaning of the words noon and midnight across the world, each country proclaims that it uses a certain deviation from UTC roughly proportional to their longitude. Each deviation from UTC is called a time zone, and represented as a positive or negative number of hours, minutes, and (real-numbered) seconds.

![Standard time](https://upload.wikimedia.org/wikipedia/commons/4/4b/Solar_time_vs_standard_time.png)
*Time zones with offset from solar time.*

As extra fun, many countries change time zones twice a year, but not at the same time. They reckon that people are disturbed by the sun in summer before their clock wakes them up. Having a curtain seemed too hard, so those countries decided to change time itself. This is called **Daylight Savings Time**.

To be perfectly accurate, one needs to keep track of all wars and laws in the world to determine the civil time at a geolocated point on the planet. Fortunately, two individuals took it upon themselves to do exactly that. They built what is now known as the [IANA time zone database][tzdata] (aka. tzdata). It determines both what each time zone code it defines has to UTC through time, and what time zone code is used for a set of famous cities spread throughout the planet. Most operating systems have a copy, which is often used to ask the user what their nearest large city is when installing it.

[tzdata]: http://www.iana.org/time-zones

So, using a geolocation coordinate, this database, and time zone borders and border changes, it is feasible to compute the civil time at all points on Earth from 1986 onwards. (You need way more data for dates prior to 1986, date when Nepal became the last country to switch to a UTC time zone.)

## Stamps

The most common representation of times and dates in computing is [ISO 8601][]. It defines a textual representation for UTC (with or without time zones), calendar dates, weeks, yearless calendar dates, and durations. The precision goes down to the millisecond. For instance, `2006-08-14T02:34:56.238-06:00`.

[ISO 8601]: https://en.wikipedia.org/wiki/ISO_8601

A variant of this is [RFC 3339][], which is more lax. For instance, `2006-08-14 02:34:56.238-0600`.

We can also find [RFC 2822][], which is used for email. For instance: `Mon, 14 Aug 2006 02:34:56 -0600`.

[RFC 3339]: https://www.ietf.org/rfc/rfc3339.txt
[RFC 2822]: https://www.ietf.org/rfc/rfc2822.txt

The second most common representation in computing is [Unix time][], in seconds, either in 32-bit integers, 32-bit unsigned integers, 64-bit unsigned integers, or in textual base-10 form (with decimal digits for more precision).

Unfortunately, there is no widespread TAI-based time stamps.