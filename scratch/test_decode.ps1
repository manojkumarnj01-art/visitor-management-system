[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "c:\Users\Lenvo Yoga 380\Documents\automatic visitor\app.js"
$lines = Get-Content -Path $filePath -Encoding UTF8

$corruptedLine = $lines[8092] # 0-indexed line 8093
Write-Host "Original corrupted line: $corruptedLine"

$w1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8 = [System.Text.Encoding]::UTF8

$current = $corruptedLine
for ($i = 1; $i -le 3; $i++) {
    try {
        $bytes = $w1252.GetBytes($current)
        $current = $utf8.GetString($bytes)
        Write-Host "Pass ${i}: $current"
    } catch {
        Write-Host "Error in Pass ${i}: $_"
    }
}
