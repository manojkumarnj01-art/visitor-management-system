# Set console output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$filePath = "c:\Users\Lenvo Yoga 380\Documents\automatic visitor\app.js"
$backupPath = "c:\Users\Lenvo Yoga 380\Documents\automatic visitor\app.js.bak"

# 1. Back up the original file
Copy-Item -Path $filePath -Destination $backupPath -Force
Write-Host "Backup created at: $backupPath"

# 2. Read the entire file content
# [System.IO.File]::ReadAllText reads with UTF-8
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$w1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8 = [System.Text.Encoding]::UTF8

$current = $content
$success = $true

for ($i = 1; $i -le 3; $i++) {
    try {
        $bytes = $w1252.GetBytes($current)
        $current = $utf8.GetString($bytes)
        Write-Host "Pass ${i} decode completed."
    } catch {
        Write-Host "Error in pass ${i}: $_"
        $success = $false
        break
    }
}

if ($success) {
    # 3. Write back the recovered content
    [System.IO.File]::WriteAllText($filePath, $current, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully wrote recovered text to $filePath"
} else {
    Write-Host "Failed to recover file. Keeping original."
}
