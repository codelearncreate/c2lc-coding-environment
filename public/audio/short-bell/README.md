# About These Files

These sounds were recorded for this project, see the LICENSE.txt file for terms
of use. The patch used is from the Arturia V Collection, and is a DX7 patch
called "ROM2A 29 - Cow Bell".

Each filename corresponds to the pitch of the note. The individual sounds are
meant to be sped up and slowed down to simulate a fuller range of pitches.

## Timing

For the purposes of coordinating the timing of sounds and animations, here is a
breakdown of the duration of every file used for this "sampler":

| Filename | Duration     |
| -------- | ------------ |
| C0.wav   | 0.481 sec    |
| C1.wav   | 0.618 sec    |
| C2.wav   | 0.613 sec    |
| C3.wav   | 0.605 sec    |
| C4.wav   | 0.612 sec    |
| C5.wav   | 0.439 sec    |
| C6.wav   | 0.411 sec    |

If you need to regenerate this timing data, on OS X you can use a command like:

```find public/audio/short-bell -name \*.wav -exec afinfo -b {} \;```
