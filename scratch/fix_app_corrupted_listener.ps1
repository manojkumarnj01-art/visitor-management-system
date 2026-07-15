$filePath = "c:\Users\Lenvo Yoga 380\Documents\automatic visitor\app.js"
$lines = Get-Content -Path $filePath -Encoding UTF8

# Restore the simulated email click listener approval execution call
$lines[3867] = '            approvePendingVisitor(activeSimulatedVisitor.id);'

# Write back to file using pure UTF-8 without BOM
$finalText = $lines -join "`r`n"
[System.IO.File]::WriteAllText($filePath, $finalText, [System.Text.Encoding]::UTF8)
Write-Host "Listener restoration completed successfully!"
