$filePath = "c:\Users\Lenvo Yoga 380\Documents\automatic visitor\app.js"
$lines = [System.Collections.Generic.List[string]](Get-Content -Path $filePath -Encoding UTF8)

# Remove the duplicate comment lines from bottom to top to avoid index shifting
$lines.RemoveAt(6563)
$lines.RemoveAt(6560)
$lines.RemoveAt(6296)
$lines.RemoveAt(6293)
$lines.RemoveAt(6223)
$lines.RemoveAt(6220)

# Write back to file using pure UTF-8 without BOM
$finalText = $lines -join "`r`n"
[System.IO.File]::WriteAllText($filePath, $finalText, [System.Text.Encoding]::UTF8)
Write-Host "Duplicate comments cleaned successfully!"
