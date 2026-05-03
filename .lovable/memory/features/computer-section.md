---
name: Computer Section
description: Computer tab in Students Portal with Typing timetable and Photoshop class system (20 lockable classes per student, posters, score)
type: feature
---
- Located inside Students Portal as "കമ്പ്യൂട്ടർ" tab (replaces old standalone Timetable tab)
- Two sub-sections: Typing (existing typing timetable) and Photoshop
- Photoshop: 7 fixed students seeded (Jareer, Sidan, Shereef, Jubair, Jinshad, Shafi K, Salman Faris)
- Each student has 20 classes (locked by default), title + YouTube link, completion toggle
- Locked → grey, Completed → green, Not completed → red
- Admin (main /admin login) can: upload photo, edit YouTube link/title, lock/unlock, mark complete, set score+remarks, upload/delete posters
- Tables: photoshop_students, photoshop_classes, photoshop_posters; storage bucket: photoshop (public)
