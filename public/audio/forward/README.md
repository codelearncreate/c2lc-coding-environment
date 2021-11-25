# About These Files

These sounds were recorded for this project, see the LICENSE.txt file for terms
of use. The patch used is from the Arturia V Collection, and is a CS-80 patch
called "Kitten Run".

Each filename corresponds to the pitch of the note. The individual sounds are
meant to be sped up and slowed down to simulate a fuller range of pitches.

## Timing

For the purposes of coordinating the timing of sounds and animations, here is a
breakdown of the duration of every file used for this "sampler":

| Filename | Duration   |
| -------- | ---------- |
| C0.wav   | 3.098 sec  |
| C1.wav   | 3.088 sec  |
| C2.wav   | 2.814 sec  |
| C3.wav   | 3.093 sec  |
| C4.wav   | 2.567 sec  |
| C5.wav   | 3.337 sec  |
| C6.wav   | 4.396 sec  |

If you need to regenerate this timing data, on OS X you can use a command like:

```find public/audio/forward \*.wav -exec afinfo -b {} \;```
