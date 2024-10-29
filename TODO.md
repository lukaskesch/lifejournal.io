## Bugs

- [ ] Stopwatch hh:m:ss bug when minutes is like 0[1-9]
- [x] Long backgrounded tab gets dropped. Maybe use `localStorage` to store start time
- [x] Don't cache server components
- [x] Fix stopwatch > 1 hour

## Improvements

- [ ] Have a now button for the end datetime for the retroactive logger
- [ ] Have loading animations / transitions (probably suspense)
- [ ] After loggin redirect to dashboard if user was on a public page before
- [ ] Find and implement color scheme
- [ ] Hide footer on /app/\*
- [x] Make tags component responsive
- [x] Add option to start log in the header and maybe add redirect to previous page
- [x] When setting start time, set end time to same day one hour later

## Features

- [ ] Have a tag where you give in to it (e.g. eating unhealthy) and where you can resist it
- [ ] Hoover on the calendar view (date, logs)
- [ ] Daily note(s) which you also get on hoover on the streaks
- [ ] Sign up
- [ ] Delete focus logs
- [ ] Log focus with only date and duration
- [ ] Edit focus logs
- [ ] Add option to pause and resume stopwatch
- [ ] List tags (name, logs count, last log date) and rename
- [ ] Give tags a color
- [x] Add streaks (days, weeks) to dashboard (and maybe to tags)
- [x] Have a calander view of focus logs and or tags
- [x] Add date range filter to focus logs
- [x] Add tag filter to focus logs
- [x] Password
- [x] Supporting multiple users (next-auth)
- [x] Make chart of hours logged per day
- [x] NavBar
- [x] List focus logs
- [x] Create tags
- [x] Live focus log
- [x] Retroactive focus log

## Documentation

- [ ] Tailwindcss
- [ ] Shadcn
- [ ] Next.js
- [ ] Next-auth
- [ ] Drizzle and mysql2
