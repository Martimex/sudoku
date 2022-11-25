# Changelog

### Includes all commits and updates regarding Sudoku World App. Note that versions lower than 1.0.0 are development ones. 

### Starting from 1.0.0, all updates are published live: https://sudokuworld.onrender.com/

<br><hr>

**[1.2.1] Improve layout across different device types**
<br>
_25.11.2022_

* This commit provides another layout update. The main changes regards
the layout for tablets (which is finally out) and for landscape-oriented
devices. Furthermore, app for huge screens and portrait-oriented devices
received a bit of changes in this regard, but less impactful.

Sudoku view:
1. Adjusted Toolbox elements sizing, to better fit for screens, which has
relatively similiar viewport width and height (f.e.: tablets);
2. Maximized Sudoku board size and increased board digits size for
better solving experience;
3. Signifficantly changed a Toolbox and NumbersBox layout for
landscape-oriented devices (to make them fit that type of screen well);
4. Modified a "New Sudoku" button to make it more spacious and placed
the text inside single line;

Landing Page view:
1. Changed play button size to make it longer;
2. Changed difficulty box sizing and slightly modified size for theme box
buttons (accross all device types);
3. Extra size modify and layout modifications for all elements (for
tablets and landscape-oriented devices);

<br><hr>

**[1.2.0] Add a digit conflict mechanism**
<br>
_23.11.2022_

* This update contains following changes:

1. Added digit conflict check mechanism.
When player places the same digit, that has already been placed within
the same row, column or 3x3 square, a slight background gradient applies
for all conflict tiles. The main idea of conflict mechanism is to warn
player whenever his action (adding a digit) is contradictory with Sudoku
rules.

2. Minor design changes to pencilmark Toolbox option, updated Sudoku
board borders and rubber.

<br><hr>

**[1.1.1] Change info tab reference links**
<br>
_06.08.2022_

* This update contains following changes:

1. Toolbox Info tab has updated links. The second one now leads
directly to a documentation file, the first transfersdirectly to a
changelog page. First link is renamed to: "Check changelog";

2. Landing page section for difficulty choose has the title changed -
now it's "Try to get Sudoku". It's essential to outline that Sudoku
difficulty is not 100% guaranteed.

<br><hr>

**[1.1.0] Add number box digit usage limit**
<br>
_31.07.2022_

* This commit contains following changes:

1) When each digit is used exactly 9 times in a Sudoku board, it can no
longer be used. It's a quality change, since there is no option that
Sudoku has more than 9 places for a digit. When limit is reached,
player cannot use this number in number box. He can undo this by
history travel or using rubber. Pencilmarks do not count to the limit.

<hr><br>

**[1.0.2] Add Sudoku full screen request**
<br>
_29.07.2022_

* New improvemnts added:

1) Fixed an issue with a newly added author logo (toolbox info tab).
Sometimes when this logo rendered, it moved the whole info content,
causing some weird container grow (bad UX). Image has now predefined
space that can be accomodated into, so this is no longer an issue.

2) When entering Sudoku component (starting a new Sudoku game), app
requests full screen mode. It is useful especially for mobile devices,
since it hides unnecessary browser search bar, maximizing gameplay space
for the player (viewport gets a bit higher). Also, by hiding search bar,
it removes another issue with dialog boxes (info, loading, reset, win),
because the main layout space for them now covers all the screen (not
all beside the bottom-side searchbar height stuff, which make the
layout look weird).

<hr><br>

**[1.0.1] Add logo, app title, app icon**
<br>
_28.07.2022_

* This minor patch contains minor visual-wise improvements. The following
are:

1) Browser icon has been added aswell as the title behind it (which is
now 'Sudoku World');

2) Added author icon which is present in Toolbox' info tab. Furthermore
it works as a link to a Github main page.

<hr><br>

**[1.0.0] 1.0.0**
<br>
_27.07.2022_

* First deployment commit ! Set 1.0.0 app version release date to
27.07.2022.


<br>

<hr>
<hr>
<hr>

<br>

**[0.7.0] Remove comments, logs and unused code**
<br>
_26.07.2022_

* This commit is a refactoring one, which brings out a bit of quality
improvement to a code. Most files has been affected, since all
unnecessary comments and useless code has been removed. This commit
has to be checked again (definitely for engine file), to make sure
that nothing important gets removed by mistake.

<br><hr>

**[0.6.34] Create error page**
<br>
_24.07.2022_

* Added error handling procedure to the application. Whenever any critical
error occurs (ones which can crash app), the error page is served for
user.

* Screen design is indeed responsive, however I intentionally did not put
much effort for visual design here. It's more informative, making the
reader to focus on message written there, rather than overall design.

* Error Boundary Component has been set on top of Landing and Sudoku
Components, so that errors can be caught and maintained in more
user-friendly approach across the whole application.

<hr><br>

**[0.6.33] Center Sudoku Component content**
<br>
_23.07.2022_

* For larger screens and monitors, all Sudoku content has been vertically
centered. Sudoku title font-size is now larger than before.

<hr><br>

**[0.6.32] Change rubber textComtent behaviour**
<br>
_22.07.2022_

* Using rubber on a tile which contains a digit (non-initial), instead of
pushing NaN to the history logs, it pushes ''. This little change might
probably prevent from further errors, which were involved by type of
textComtent of rubbered tile.

<hr><br>

**[0.6.31] Finish Win screen responsive layout**
<br>
_22.07.2022_

* Win screen layout has been finished. Unlike the other views, this one
did not require much of changing. Basically, minor change has been
applied to only huge screens. Mobile devices works perfectly fine even
with basic Sudoku CSS. Ultimately, each of remaining dialog boxes has
their overflow issue solved.

<hr><br>

**[0.6.30] Update info tab**
<br>
_20.07.2022_

* This commit contains following changes regarding Toolbox info tab:

1) Added responsiveness for landscape oriented screen (mobiles) and for
larger screens like monitors. The first media query targets lowering
overall view size to fit viewports with low height. The second one was
making the tab  more spacious, enlarging font-sizes and adding more
space (extra padding).

2) Version and release date values are now dynamic. Now a new file
stores all necessary pieces of information regarding current version
and it's release date. When any new update came, this new file would
be the one to update.

<hr><br>

**[0.6.29] Prepare responsive design for reset button**
<br>
_20.07.2022_

* Reset button received some responsiveness regarding landscape oriented
screens and larger screens. Its max width has been lowered in order
make it look more like a square-shaped box. That also resolves an issue
with one-line-length stretched text (which might be unpleasant to read).
Apart minor font-size changes have been applied to fit them better to
larger screens.

<hr><br>

**[0.6.28] Solve dialog boxes bug**
<br>
_19.07.2022_

* This commit includes two significant changes:

1) Loading page (in between Sudokus) has been adjusted for various
screens (designed responsively);

2) Dialog boxes (such as reset / info / win) had their backgrounds not
covering the whole space of the page. It was visible when player opens
up one of those dialog boxes, and tried to scroll up or down - making
component specific background blank in bottom of the screen. Now,
whenever players opens dialog box, he gets redirected to very top of
the page, blocking overflow (vertical / horizontal scrollbars) until
such dialog box gets closed. This feature is currently 100% prepared
only for reset box. However further commits would also fix the issue
for remain dialog boxes.

<hr><br>

**[0.6.27] Prepare game page for various devices**
<br>
_17.07.2022_

* Next responsive-based commit is there! This time I have made a fresh
update to main in-game page layout. It is scaling well with portrait
oriented devices aswell as for landscape oriented ones. Apart from that,
desktop/laptops version has been implemented, which generally adds
some extra font-sizes (comparing to landscape mobiles media query).
Tablets version still remains to-do, however even in current version it
looks a bit better than for a landing page for tablets.

<hr><br>

**[0.6.26] Finish responsive landing page**
<br>
_16.07.2022_

* Landing page is now fully responsive across most tested devices. Nearly
all smartphones fits perfectly to created media queries as well as
huge monitors / screens (laptops and desktops). The only device type
for which design is quite poor are tablets. The layout for some of
such devices covers not even half of the screen, making the whole
thing looking very small. Hopefully, this part would be updated later.

<hr><br>

**[0.6.25] Finish day theme**
<br>
_14.07.2022_

* This commit includes extended light mode layout changes. It mostly
was about balancing colors (appplying more contrast between bright
background and other colors used). Also hover effect has been added
for buttons, which would be useful for non-mobile users. However this
commit is not ultimate layout commit, meaning that some visual updates
will be applied if necessary.

<hr><br>

**[0.6.24] Correct landing page light theme**
<br>
_13.07.2022_

* First part of updating light theme across the app is done. This one
took a couple of hours to complete, because adding text color for
difficulty squares required some decent changes.

<hr><br>

**[0.6.23] Add timer stop condition**
<br>
_12.07.2022_

* Whenever player choose to play a Sudoku with timer included, he/she is
able to stop it by clicking onto a Info tab (Toolbox part). By clicking
'Close' button on Info screen, timer gets reactivated as Info screen
disappears.

* Additionally, Sudoku puzzle rendering time limit has been slightly
decreased - from 2000 ms to 1750 ms. It's an experimental change,
meaning if it is involving upcoming errors, time limit will be reverted
back to its' original value.

<hr><br>

**[0.6.22] Complete Info Tab**
<br>
_10.07.2022_

* Very last Toolbox feature has been created. After clicking on Info tile,
player can check the recent app version and latest patch release date.
There's also some useful links - one redirects to app official
documentation (to do...), the other one transfers to guide that would
be made after finishing the app. At the bottom player can see the
authors logo, which would be a link redirecting to Github main page.

<hr><br>

**[0.6.21] Update and activate options section**
<br>
_08.07.2022_

* Options section in Landing Page has received significant update. Now
player has two options to toggle:
1) Timer - player can determine whether he/she wants to play Sudoku with
timer included or not. If he/she does, then Sudoku Win scren would also
include final time which took player to solve puzzle. Default value:
false;
2) Backlit - player can determine whether he/she wants use tile higlight
feature (described in one of recent commits) or not. Default val: false.

* All features are corresponding well with each, making the app almost
completed.

<hr><br>

**[0.6.20] Add Sudoku completion screen**
<br>
_07.07.2022_

* Whenever player solves Sudoku puzzle, a completion screen is shown.
This screen indicates that Sudoku is done correctly (all digits are
appended into correct tiles). Viewing this screen, player has two
options. He/She can either return to the Landing page (and change some
options maybe) or he can get new Sudoku (Sudoku reset mechanism apply).

<hr><br>

**[0.6.19] Add reset confirmation screen**
<br>
_06.07.2022_

* Whenever player starts solving Sudoku puzzle (taking action: either
applying a number or pencilmark), engine treats this puzzle as started.
Whenever player wants to reset a puzzle that has already been started,
confirmation screen is showing up, warning that this action would
remove all the progress made. Screen does not show up when player didn't
take apply any number to the board. This screen is mostly decorated
well, but it is not theme-based yet.

<hr><br>

**[0.6.18] Introduce outdated pencilmarks auto-removal**
<br>
_05.07.2022_

* This commits brings out new quality changes to the project. From now on,
whenever player apply digit into a tile, from all tiles that share
either the same row/column or square, got this digit removed as a
pencilmark option. It makes it more comfortable for the player to work
on Solving process. Furthermore, 1 minor bug from recent commit has been
patched (-> travelling back and forth in history had no effect on
highlight tiles changes, which was staying at the place of lastly
clicked tile).

<hr><br>

**[0.6.17] Add onClick tiles highlighting**
<br>
_05.07.2022_

* New feature has been added - tile highlighting. Whenever player clicks
onto a tile that is not an initial tile, all remain tiles within the
same row, column and square are also highlighted (color is based on
Sudoku difficulty). It might be a general UX improvement in terms of
easier pencilmarks applying or making some checkouts by a player.

<hr><br>

**[0.6.16] Update Sudoku layout- loading screen, reset button**
<br>
_03.07.2022_

* Minor UI improvements regarding two most (so far) neglected parts:
loading screen and reset button. For loading screen, every  element
belonging is now properly centered, having a bit of its' own space.
Reset button received a color based on Sudoku puzzle difficulty, and
got some size changes too.

<hr><br>

**[0.6.15] Optimise initials removing process**
<br>
_03.07.2022_

* This brief commit includes another major UX improvement. Sudoku loading
time for pessimistic cases has been standardized. The aproximate maximum
time Sudoku can load is about 2800 ms (very rare case, since most likely
pessimistic cases tend to load in 2100 ms). This change also preserves
unicity of puzzle + player does not have to wait like 10 seconds for
loading very pessimistic time-wise puzzles.

<hr><br>

**[0.6.14] Solve another 2 bugs**
<br>
_30.06.2022_

* This commit contains another bug solving update. Below are detailed
bug descriptions:

1) Visual pencilmark bug - when player turn pencilmark mode on, and then
press "Sudoku reset" button, pencilmarks mode was removed, but
animation which was indicating pencilmark mode: "on" was still running,
making it very confusing for the player to determine whether pencilmark
mode is "on" or "off".

2) Disappearing initials classes - sometimes, when player resets Sudoku,
initials (starting tiles filled with numbers) were left without initial
class, which disables player from modifying their values.

<hr><br>

**[0.6.13] Solve history travel bugs**
<br>
_30.06.2022_

* Last changes modifies history travel behaviour a little bit, which
ended up with new bug, which causes history board to render 3 to 4
times at the start, forcing problems while travelling. It is no longer
an issue. Another seen bug was from the past - but it was considered
as solved - so now it probably has been ultimately neutralized. It was
associated with rubber usage and history travel, causes one of history
step tile to have value of null. Instead, when it happens, this value
is converted to NaN, which is acceptable solution, which also indicates
that this tile it's not just a blank tile, but blank tile which has been
modified by a player.

<hr><br>

**[0.6.12] Add loading screen during very first Sudoku render**
<br>
_30.06.2022_

* When player clicks "Play" button on landing page, it also shows the
loading screen there (as it was only for reset Sudoku button before).
Furthermore, a weird flash during first render has been also neutralized
It was showing part of the board layout, which was suddenly
interrupted by loading screen, which caused the flash.

<hr><br>

**[0.6.11] Minor refactoring & bug solving**
<br>
_29.06.2022_

* New changes to rendering mechanism has been applied. It no longer relies
on board state, which used to be impractical and could negatively impact
further app improvements. Also it helped solving issue, when player
qucikly resets the board, which as a result was showing completely
solved sudoku for a brief duration.

<hr><br>

**[0.6.10] Complete Sudoku login screen**
<br>
_26.06.2022_

* Rendering new Sudoku process now has it's own view that is visible
during rendering time. This commit also includes some minor
overall improvements.

<hr><br>

**[0.6.9] Update reset button**
<br>
_24.06.2022_

* Update mechanism has receive a small update. Each reset has minor
animation, making the reset transition much smoother. Apart, there
is a screen when new Sudoku is loading - however this screen still need
a bit of improvements in terms of overall look. Next focus would focus
ultimately on updating the resetting process (visually).

<hr><br>

**[0.6.8] Create Sudoku reset button (raw)**
<br>
_22.06.2022_

* Sudoku resetting mechanism is prepared. It enables to player to get
new Sudoku almost instantly, without need to reset the whole app in
order to do so. That feature is only prepared logic-wise, visual updates
are highly demanded.

<hr><br>

**[0.6.7] Resolve history travel related bug**
<br>
_21.06.2022_

* Bug happened when using rubber and then moving through history. It was
possible to append NaN instead of ''. Furthermore, this issue lead to
an error, which crashed the app (most probably that was the reason
for that). However, some insights would be taken to make sure that this
error would never happen again.

<hr><br>

**[0.6.6] Finish visual aspects of history travel**
<br>
_21.06.2022_

* History travel visual effect has been successfully applied ! Now, when
travelling through moves history, cursor follows along to recently
modified tile. Furthermore, history travel buttons have visual effect
which determines whether clicking it would make any difference (or not).
Next part to work on is applying temporary button to render random
Sudoku again - when player would not get Sudoku with desired difficulty,
he can simply press this button to render new one again.

<hr><br>

**[0.6.5] Small bugfix update**
<br>
_20.06.2022_

* Fixed a history travel issue:
 1. When player travels back to some single digit tile, and cut the history
from here by providing the exact same number, numbers are no longer
doubled in history - instead the second version is this number removed
by simulating rubber effect.

<hr><br>

**[0.6.4] Complete history travel mechanism**
<br>
_20.06.2022_

* From now on, player can freely travel through history of moves, and at
any convenient time, override it (in order to start on some point in
the past and solving from a given point). Main functionality seems to be
completed (no known bugs here). Only thing left to work on is some
visual stuff:

1) When history "undo" or/and "redo" buttons would have not any effect
when using in current step, let's indicate that (visually);
2) When travelling through the game history, game cursor should follow
along.

<hr><br>

**[0.6.3] Work on finishing history travel**
<br>
_19.06.2022_

* History travel still remains under development, however there has been
made quite significant progress. Player now can travel thorugh game
history, to view and check his recent movews. Additionally, he is almost
able to override that history to append new move at some place (is still
does remove "newer moves"). There is noticeable bug when occurs, when
players wants to override the history, and then changing the tile from
being "pencilmark tile" to "single-digit tile" (and vice-versa). This
feature need to have an fix. Last thing regarding history travel would
be: whenever player goes back/forth in moves, the "active class cursor"
should also follow him along.

<hr><br>

**[0.6.2] Prepare Sudoku Board tracking mechanism**
<br>
_17.06.2022_

* Sudoku component now keeps track of the pace of the game. It detects
user moves, and act accordingly within special variable, which stores
current board progress, aswell as moves that has been made throughout
the game. It also includes pencilmarks. There are also mechanisms that
prevent from applying useless history logs (like erasing the empty tile,
erasing non-existent pencilmarks).

* This action would be useful in order to complete back & forth mechanisms
, which would allow player to take some moves back (and then forth, if
necessary).

* In order to complete this part, next commit would focus on rendering
chosen move on the screen, also applying this mechanism for buttons.
Last thing to work on is history interrupting - when player moves back
somewhere and want to take a new move from there, all further moves
(which were present as "later than this" moves) should be ultimately
removed from the game.

<hr><br>

**[0.6.1] Completed pencilmarks**
<br>
_14.06.2022_

* Pencilmarks is the very first feature introduced as a player solving
tools. It enables to mark a tile for possible candidates (which might
be espacially useful for harder Sudokus). Marks can be removed only
when pencilmarks mode is off. The basic mechanism is fully completed,
however there are two main aspects, that can be improved there:

1) When applying number to a tile, remove it's pencilmarks from the same
row, column and square;

2) Improve animations when adding new pencilmark - adding new pencilmark
to a tile, which already have some pencilmarks, should force the
animation to work only for this new pencilmark, not for remain ones.

<hr><br>

**[0.6.0] Prepare in-game tools**
<br>
_12.06.2022_

* After choosing a Sudoku difficulty, and getting into the game, new
buttons appears. Those are: info, undo, redo & pencilmarks. Buttons are
now only visible - none of them provide any function yet. However it is
gonna change quickly. Further commits would add their function-specific
features + those buttons layout would be improved.

<hr><br>

**[0.5.2] Update layout to fit random difficulty**
<br>
_31.05.2022_

* Layout is now more flexible - it no longer relies on what difficulty
user choose, but what difficulty would be actually rendered. That is
probably the last change directly affecting engine file. It's the
right time to start making some extra functionalities. The main focus
would be enabling pencilmarks, which will make solving process much
more appealing and comfortable for user.

<hr><br>

**[0.5.1] Engine approach modified**
<br>
_30.05.2022_

* This part was abslutely tremendous ! Involved a lot of issues around
time execution when trying to set sudoku difficulty to what player did
choose. Going forward was making things much worse, so I've taken a step
backwards. Time execution is now much more stable (sudoku usually
renders under 1 second), but there is a tradeoff for that: a sudoku
with random difficulty is being rendered. For now it means, player can
not choose Sudoku difficulty, however Sudoku is able to determine the
difficulty of rendered board, so player would get notified about that.
In the future I'll try to apply this difficulty choose to the game (with
actually proper time rendering). Currently there would be some extra
adjustments to do regarding this functionality change.

<hr><br>

**[0.5.0] Engine optimisation begin**
<br>
_23.05.2022_

* The last engine part process has been officially started! This commit
includes some simple initial preparations:
1) Prepared bestMethod variable, which indicates the hardest solving
method no that helped solving sudoku. If sudoku remains unsolvable
using each implemented method, then bestMethod equals 'null'
2) Connected bestMethod with hideDigits function, so it can be used
inside hideDigits.

* However, hideDigits function has to be rebuild. It no longer should rely
on start initials count, but on the index of hardest method applied. It
would probably require using recursion for that.

<hr><br>

**[0.4.22] Complete SwordFish method**
<br>
_22.05.2022_

* SwordFish has been completed ! After a few tests done, it's also
working properly! There's no known errors for now, and I will take a
closer look if it remains as it is for now. Now on, all necessary
methods are completed ! The ones ommitted are:
1) Three doubles (a hidden subset sub-function) -> throws errors, so it
was commented out for now;
2) Forcing chains - maybe would be implemented in the future;
Next part to finish huge engine part, is to make some time optimisations
in order to make sudoku grids and proper difficulty adjustment real
quick.

<hr><br>

**[0.4.21] Finish X-wings**
<br>
_21.05.2022_

* X-wings are now created. It has been tested using 2 specific cases
(one for row and one for column) and they are not throwing any
errors - they are finding the right number apart ! That's pretty
sure it's written 100% correctly. At last it is necessary to
finish off with Swordfish method, which would be the last method
to implement (at least for now). It is very similiar to X-wings, but
a little more difficult conceptually and coding-wise.

<hr><br>

**[0.4.20] Complete X-wing main checker function**
<br>
_20.05.2022_

* X-wing detect mechanism has been implemented successfully. Now the only
thing that remains (regarding this method) is to add and fill the
ultimate grid updating process if x-wing helps us solving sudoku.
At last, after completing x-wings, swordfish main checker function has
to be built on top of what is achieved here, but with minor,
method-specific modifications.

<hr><br>

**[0.4.19] Prepare X-wings / Swordfish initial variables**
<br>
_19.05.2022_

* Main preparation for x-wings and swordifs methods are done! We have
two properly working variables. First indicates which numbers in
current lines exist exactly twice as an option; second one indicates
the number indexes (in which tiles in line this number is as an option).
It also means that those variables will always have the same length.
Important nore is that Hidden Three Doubles has been detected to throw
errors! For now it has been nullified and this very last part of hidden
subset is now longer trying to remove digits. This hidden subset part
requires some deeper insight into potential issue that lead to this
error. But it's not very important (as long as it is nullified).

<hr><br>

**[0.4.18] Finish Hidden Subset Method**
<br>
_07.05.2022_

* Hidden Subset (and all his sub-functions) has been finally completed.
Three double hidden subset seems not to be testable as hidden normal
subset can do part of its' job. The conclusion might be that TDHS
either would never be useful or only useful for very rare, specific
cases. It doesn't seem to be throwing errors, so it is fine for now.
From now on hard-rated methods are completed, and now we can move on
to implementing X-wings, which is first method rated as extreme
difficulty.

<hr><br>

**[0.4.17] Finish hidden Subset double/tripple normal part**
<br>
_05.05.2022_

* The basic part of hidden Subset has been implemented. It has been
tested very strictly to ensure it works properly. Hidden Subset in total
is almost done - the very last function to provide is actually
Three Double Subset - in case of hidden version, we don't care about
the length of those three subsets, but we check if three of them
contains three unique digits (two of three for every element), and if
we found something, we update only the subset elems.

<hr><br>

**[0.4.16] Complete hidden Subset function-Incomplete tripple**
<br>
_03.05.2022_

* After lots of errors, the very first part of hidden Subset is ready to
go. Incomplete tripple subset is finally implemented. It's a very
case-specific method, which works rarely, but seems to be very helpful.
For that method I've implemented new testing method, which allows to
pass any grid to it, and check if for that specific grid currently
developed function helps. It might be very handy for more complex
solving methods. Now last two parts for hidden Subset is: 1) to focus
on it's main ability (checking for three tripples or two doubles of any
length, but with three or two unique numbers), and to implement
three double subset (same here - we don't care about its' length,
but we care if three subsets have three unique digits, that are
present twice for dimension, and only in two of three potential subset
elems).

<hr><br>

**[0.4.15] Finish naked subset method**
<br>
_27.04.2022_

* Naked subset is finally completed ! All of three method parts do the
right job without throwing errors. This method was incredibly time
consuming, since it was like 3 little methods in one. After tough
issues and errors, this can be sign as completed. Now it's time to
go for the last method marked as hard, which is Hidden Subset.

<hr><br>

**[0.4.14] Finish incomplete tripple subset, naked-S function**
<br>
_25.04.2022_

* The second part of naked Subset method has been implemented and tested
and it works great. No issues, simply does what it's supposed to. to
finish this method off, the very last part - tripple double subset -
needs to be implemented. It's the last helper function for naked Subset
method. After completing it, the hidden Subset would be the main deal.

<hr><br>

**[0.4.13] Develop part two for naked subset**
<br>
_24.04.2022_

* Naked subset part two functions are now prepared for deployment.
Currently working on "incomplete tripple subset" one, which is going
quite well and simple so far. Apart from that, in order to finish naked
subset method, it is also necessary to create "tripple double subset"
function and append it to naked subset method.

<hr><br>

**[0.4.12] Create part 1 of naked subset method**
<br>
_22.04.2022_

* After numerous of bugs, the first part of this method has finally been
created. Now this method looks for a double of tripple subsets (it is:
getting x(2 || 3) tiles with x options that have the exact same numbers
inside). If they do, we can remove those numbers from other non-subset
tiles. The great thing is that now it's working perfectly. The last
thing to do in this method is to apply 1 specific method for double
subsets - tripple "doubles" containing 3 different numbers (2 of each)
and 1 specific method for tripples - uncomplete tripples (which might be
either 2x tripples 1x double or 1x tripple 2x doubles) containing only
three numbers.

<hr><br>

**[0.4.11] Rebuild naked subset method**
<br>
_21.04.2022_

* Naked subset method has been rebuilt in order to reduce its complexity
and overall length. Now the function looks more clear, however it still
doesn't remove the issue which causes to remove invalid grid options.
That problem results in throwing errors (most likely) or not abiding
sudoku rules (for example, digit 4 was seen 3 times in a single row).

<hr><br>

**[0.4.10] Prepare Naked Subset First General Rule Part (err)**
<br>
_20.04.2022_

* Naked Subset Fundamental rules has been applied to the engine.
The main rule states, that whenever we have x tiles with x options in it
and that options are all the same for those tiles, that means other
tiles would not have those digits, and they can be removed from them.
Mechanism is applied for double and triple subsets - quad subsets are
incredibly rare, so it is not obligatory to implement quads (for now at
least). However, there's some double and tripple specific parts that has
not been added yet + even this main rule seems to throws error, so
getting rid of it is the top priority now.

<hr><br>

**[0.4.9] Create Double Pairs method**
<br>
_17.04.2022_

* Dobule Pairs are finally fully implemented! It actually seems to be
working perfectly fine, since no tests has detected errors / mistakes
made by this method. So thankfully, we can move on to the next method,
which is Multiple Lines (the last medium-rated method).

<hr><br>

**[0.4.8] Double Pairs almost done**
<br>
_16.04.2022_

* Double Pairs mechanism is almost implemented. There is a bit to do
mostly with control flow - whether the function helps to find a digit
or not. Apart from this, the function has to be further tested to check
if works as desired.

<hr><br>

**[0.4.7] Prepare Double Pairs mechanism**
<br>
_15.04.2022_

* Double Pairs method is being created from now. Technique is still under
development, but it seems like it's goind the right way, since it doesn't
involve any issues. The only minor problem is to filter an array based on Set
values, but that's quite simple to solve on own.

<hr><br>

**[0.4.6] Finish Candidate Lines method**
<br>
_13.04.2022_

* Cnadidate Lines are finally implemented! That was quite difficult task
at first, but rewriting the whole method paid off. It seems like
everything works absolutely OK with this function, so currently there's
no point modifying it. Now we'll gonna focus on implementing fourth
method - (#4) Double Pairs, ranked as Medium technique.

<hr><br>

**[0.4.5] Update Sudoku Preparation Mechanism**
<br>
_13.04.2022_

* Sudoku is now creatin valid grids with just one solution. Bug has been
detected yesterday, so it was necessary to get rid of it asap. Now
since it is certain that engine return unique sudoku grid, we can move
on to next solver methods (working on Candidate Lines atm).

<hr><br>

**[0.4.4] Try to implement Candidate Lines mechanism**
<br>
_12.04.2022_

* Some improvements are still being made to Candidate Lines technique,
however it turns out that Sudoku is not always returning one-solution
grids, which forces to check the issue and  resolve it first.

<hr><br>

**[0.4.3] Prepare for Candidate Lines mechainsm**
<br>
_10.04.2022_

* Here is the third method that Sudoku solver is going to learn -
Candidate Lines. For now the main template for this function is prepared
, however it is still throwing some errors. This method has to be
checked if works correctly and errors has to be removed from it.

<hr><br>

**[0.4.2] Apply iterative back&forth solving paradigm**
<br>
_08.04.2022_

* Currently, sudoku has just two solving methods: Single Candidate and
Single Position. However, solving engine has been improved, so that
whenever a Single Candidate does not find any digit, we are moving
forth to Single Candidate to check if that helps. If it does, then we
are moving back to Single Candidate, etc. If however Single Position
will not help too (meaning we do not have any other methods to test),
then we end solving mechanisms.

<hr><br>

**[0.4.1] Apply Single Position mechanism**
<br>
_08.04.2022_

* From now on, Sudoku engine is not only capable of filling gaps that
match Single Candidate rules, but it works for Single Position aswell.
Engine seems to be working well for now - but it is still necessary to
apply some harder solving concepts to the enginge, and make it iterable
(going from easiest to hardest method - if a method helps finding
a digit - by applying digit or removing options - go back to the easiest
method; if did not help -> then find a harder method. If no method
found, return some note...)

<hr><br>

**[0.4.0] Prepare sudoku solver algorithm**
<br>
_04.04.2022_

* Now, in order to predict the actual sudoku difficulty, computer has to
solve it first and give results back with some kind of scores (or value)
that determines the overall toughness. Currently, computer is being
taught two basic methods - Single Position and Single Candidate. Single
Candidate is already done (without any known bugs); Single Position is
still being made (square checker part is undone yet), and it sometimes
may throw a bugs - (column checker part probably). Then this Single
Position method has to be improved asap.

<hr><br>

**[0.3.3] Improve engine to create only unique sudokus**
<br>
_03.04.2022_

* The engine is capable of creating sudokus, that are unique every
single render. However, the remarkable tradeoff is that the
difficulties have been nullified by above mentioned change (it is not
really possible to choose the initial digit count and force sudoku to
keep those while being unique). Thankfully, there is an actual option,
which forces computer to solve sudoku using different known techinques,
and giving 'scores' per difficulty and it makes them more maintainable.

<hr><br>

**[0.3.2] Create mechanism checking if sudoku is unique**
<br>
_03.04.2022_

* It's actually some sort of improvement made on backtrack algorithm.
It now looks for solution twice. First time it checks from tiles 1 to 81
from numbers 1 to 9; at second run it goes from tiles 1 to 8, but from
1 to 9 this time. If the result of both match - that means sudoku is
unqiue. If not, we have sudoku with 2 or more solutions.

<hr><br>

**[0.3.1] Create sudoku backtracking algorithm**
<br>
_01.04.2022_

* Backtracking has been finally created, but it needs some modifications.
It is capable of showing proper sudoku solution, but just one. In near
future it has to gether all possible solutions to the board, and
giving back a note whether sudoku has one or more solutions. Long run
it will help detecting and describing, what conditions are that makes
sudoku with multiple solutions, and thus better dealing with and
avoiding them.

<hr><br>

**[0.3.0] Introduce backtracking**
<br>
_31.03.2022_

* Backtrack algorithm is now being created. We need to check if our Sudoku
has only one unique solution, which makes backtrack algorith usage
mandatory here. It is still during development, however it will
signifficantly help dealing and finally getting rid of sudokus with
more than one solution.

<hr><br>

**[0.2.15] Retrieve initials 'untouchability'**
<br>
_30.03.2022_

* Minor bug has been resolved - initials were targetable and modifiable.
It is no longer the case, so as all known errors.

<hr><br>

**[0.2.14] Resolve errors regarding easy and medium sudokus**
<br>
_30.03.2022_

* Few errors occur sometimes when trying to hide certain amount of
digits (non-initials). Engine had no possible options, throwing an error
while trying to hide new digit. There has been made a tradoff, that,
whenever this scenario happens, engine immediately stops hiding digits.
In worst case scenarios, player has about two more digits shown at
start (initials). It mainly applies to easy sudokus, very rarely to
medium ones; never to hard and master difficulties.

<hr><br>

**[0.2.13] Update minimal digit count as a sudoku condition**
<br>
_28.03.2022_

* Another condition has been successfully added. Now sudoku engine also
cares about how many of digits are displayed. Each difficulty has a
special strict condition about it, which prevents unique digits
from not being displayed on any place in the board. It also limits the
amount of minimally shown digits that can be.

<hr><br>

**[0.2.12] Apply minimal initials in square condition**
<br>
_27.03.2022_

* Minimal initials in square has been added. It is based on difficulty
first, but the second important thing is that number of squares with
minimal initials is also specified and abided.

<hr><br>

**[0.2.11] Update Sudoku rules**
<br>
_27.03.2022_

* More specific and strict sudoku digit placement rules have been
introduced. Now, apart from random number of initial tiles (based On
difficulty), minimal initials in each square and minimal digit
count are added.

<hr><br>

**[0.2.10] Resolve minor bug**
<br>
_25.03.2022_

* Bug has been detected when clicking on the border of numbers palette.
It occurs to pick all the numbers and append them to chosen tile,
which of course should never happen.

<hr><br>

**[0.2.9] Design layout for Sudoku**
<br>
_25.03.2022_

* Sudoku layout has been greatly updated, which bases on State values
gathered from the user, choosing theme and difficulty properties.
Layout looks more 'smooth', and there are some cool font changes too!

<hr><br>

**[0.2.8] Sudoku visual update**
<br>
_25.03.2022_

* Minor improvements to sudoku appearance. Number palette has some
significant visual updates (black borders, each number has its
background). Also the chosen tile is now easier to spot because of
infinite animation, which changes color while the tile is focused.

<hr><br>

**[0.2.7] Create sudoku board filling mechanisms**
<br>
_23.03.2022_

* Player can now fill in sudoku board with numbers. The working
functions are still experimental, design is terrible aswell, so those
things have to be improved definitely. At that time, player is able to
try completing sudoku, but it has not been set strict rules of how to
place initial numbers on the board.

<hr><br>

**[0.2.6] Design numeric palette**
<br>
_19.03.2022_

* Numeric palette is now being developed. The main thing to do is work on
its actual appearance when empty tile is clicked - it has not to overlap
the left and right edge of the screen. Minor palette improvements has
been done so far.

<hr><br>

**[0.2.5] Create number palette and starting sudoku game**
<br>
_18.03.2022_

* Sudoku is now being generated with initial numbers only. The
starting concept is hugely simplified, however it will get updated
in near future. The difficulty patterns are not fully implemented yet.
Numeric palette has been introduced - it shows up whenever player
wants to fill an empty tile with a number. It is still during
development.

<hr><br>

**[0.2.4] Prepare sudoku rules based on difficulty**
<br>
_17.03.2022_

* Now it is the time to go for in-depth of sudoku mechanism. By
introducing various difficulties, different conditions has to be made
for each of them. Thing to considered are: initial digits revealed
count, how much of them can be in 1 square (limit), and so on.

<hr><br>

**[0.2.3] Create sudoku generator engine**
<br>
_17.03.2022_

* Sudoku is now capable of generating filled (and valid) grid, with no
error throwing patterns. Execution time seems quite okay - there is a
sudden flash between rendering, but it can be hidden using proper
animation.

<hr><br>

**[0.2.2] Work on engine - once again**
<br>
_14.03.2022_

* Engine is closer to complete, but still error can be thrown. Going to
try implementing a solution and some extra engine mechanics preventing
from wrong number placement - which leads to that kind of errors.

<hr><br>

**[0.2.1] Improve game engine (2)**
<br>
_13.03.2022_

* Major improvements have been done for sudoku engine. Sometimes it is
able to correctly render Sudoku 9x9 board. However, in most cases
error is thrown, which disables the app and further rendering the board.
That issue is not known yet, will be testing what is the problem here.

<hr><br>

**[0.2.0] Improve game engine**
<br>
_12.03.2022_

* Game engine requires huge amount of precision and dedication to make it
work properly. I am trying to add some kind of "smart mechanics" -
engine would better distribute digits onto tiles. Still working around
some bugs, but slowly getting rid of them.

<hr><br>

**[0.1.9] Create and develop Sudoku engine**
<br>
_31.01.2022_

* It's time to develop game engine. Engine is moved to another file, so
that it will be separated from any components. Engine will hold all
necessary functions that would be responsible mainly for suoku map
creation, possible number choices after tile click, and so on.

<hr><br>

**[0.1.8] Create Sudoku nested Component Structure**
<br>
_30.01.2022_

* Sudoku Component has been divided into smaller components to reflect
unicity of various elements that make up the board.
Divisions:
1) Board (a.k.a. Sudoku Component) - x1
2) Square (consists of 9 smaller squares (tiles)) - x9
3) Tile (smallest unit) - x9 for every Square; total is x81

Also, the independent order pattern for all Tiles has been implemented.

<hr><br>

**[0.1.7] Detect user choices inside Sudoku component**
<br>
_29.01.2022_

* Sudoku Component is now able to read all state values that
user could possibly choose from Landing component options.
Gathered values would be useful for painting and rendering the
right view for user (and would impact inner logic aswell).

<hr><br>

**[0.1.6] Lift up the state**
<br>
_29.01.2022_

* State has been moved up from Landing Component to App Component.

<hr><br>

**[0.1.5] Created button appear animation**
<br>
_29.01.2022_

* Play button component has been recreated into class Component, in order
to apply componentMount function and fire showUp animation only once,
after chosing game difficulty for the first time.

<hr><br>

**[0.1.4] Finish landing page**
<br>
_26.01.2022_

* Landing page is finally done! Designed in terms of scalability and
accessibility, with minimalistic elements. Further improvements are
planned, mainly around  visual aspect and general UX.

<hr><br>

**[0.1.3] Improve theme & difficulty visuals + user choices**
<br>
_25.01.2022_

* Both of them seems to be completed for now, but there's also tab
section remaining - still to improve.

<hr><br>

**[0.1.2] Complete landing page**
<br>
_24.01.2022_

* Landing page is designed! It requires, however, adding logic and click
events for buttons, user option choses, etc. Also a bit of visual
improvements would be highly demanded here.

<hr><br>

**[0.1.1] Landing page set up**
<br>
_23.01.2022_

(No description provided)

<hr><br>

**[0.1.0] Initialize project using Create React App**
<br>
_23.01.2022_

(No description provided)

<br>
