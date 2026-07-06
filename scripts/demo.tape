# Record with: npm run record:gif
# Requires: https://github.com/charmbracelet/vhs

Output image.gif

Set Shell "bash"
Set FontSize 22
Set Width 960
Set Height 360
Set Padding 24
Set Margin 16
Set MarginFill "#1e1e2e"
Set Theme "Catppuccin Mocha"
Set Framerate 15
Set TypingSpeed 35ms

Hide
Type "cd {{PWD}}"
Enter
Sleep 200ms
Type "clear"
Enter
Sleep 100ms
Show

Type "node scripts/record-demo.mjs 32"
Enter
Sleep 5s

Hide
Sleep 200ms
