# About These Files

These sounds were recorded for this project, see the LICENSE.txt file for terms of use.  The patch used is from the
Arturia V Collection, and is a CS-80 patch called "Kitten Run".  The arpeggiation for that patch plays a note and then
an octave lower, for these sounds I had to turn off the arpeggiation and play an octave lower and then the note for
which the file is named.

Each filename corresponds to the pitch of the note.  The individual sounds are meant to be sped up and slowed down to
simulate a fuller range of pitches.

## Timing

For the purposes of coordinating the timing of sounds and animations, here is a
breakdown of the duration of every file used for this "sampler":

| Filename | Duration   |
| -------- | ---------- |
| C0.wav   | 2.896 sec  |
| C1.wav   | 2.913 sec  |
| C2.wav   | 2.522 sec  |
| C3.wav   | 2.308 sec  |
| C4.wav   | 1.963 sec  |
| C5.wav   | 1.802 sec  |
| C6.wav   | 0.904 sec  |

If you need to regenerate this timing data, on OS X you can use a command like:

```find public/audio/backward -name \*.wav -exec afinfo -b {} \;```
