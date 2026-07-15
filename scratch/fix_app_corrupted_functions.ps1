$filePath = "c:\Users\Lenvo Yoga 380\Documents\automatic visitor\app.js"
$lines = Get-Content -Path $filePath -Encoding UTF8

# Restore promptRejectVisitor header
$lines[1801] = 'window.promptRejectVisitor = function(visitorId) {'

# Restore approvePendingVisitor header
$lines[4156] = 'window.approvePendingVisitor = function(visitorId) {'

# Restore the simulated email inbox approval handler call
$lines[6588] = '                setTimeout(function() { approvePendingVisitor(visitorId); }, 700);'

# Write back to file using pure UTF-8 without BOM
$finalText = $lines -join "`r`n"
[System.IO.File]::WriteAllText($filePath, $finalText, [System.Text.Encoding]::UTF8)
Write-Host "Function restoration completed successfully!"
