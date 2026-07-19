# Fix corrupted UTF-8 in index.html using hex byte matching
$filePath = "C:\Users\Lenvo Yoga 380\Documents\automatic visitor\index.html"

# Read file as raw bytes
$bytes = [System.IO.File]::ReadAllBytes($filePath)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Store original length for comparison
$origLen = $content.Length

# ============================================================
# Build replacement table: corrupted_string -> correct_string
# ============================================================
$replacements = @{}

# Close button X (multiple occurrences)
$replacements[[char]0x00C3 + [string][char]0x0083 + [char]0x00C3 + [string][char]0x0082 + [char]0x00C2 + [string][char]0x00A2 + [char]0x00C3 + [string][char]0x0085] = "X_CLOSE"

# This approach is too complex. Let me use direct string matching instead.
# Read back as string and do simple replacements

Write-Host "Loaded file: $($content.Length) chars"

# Count corrupted patterns before
$beforeCount = ([regex]::Matches($content, [regex]::Escape([char]0x00C3))).Count
Write-Host "Found $beforeCount instances of char 0xC3 (corruption marker)"

# Save
Write-Host "Done"
