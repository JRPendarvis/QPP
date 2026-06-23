param(
  [Parameter(Mandatory = $true)]
  [string]$SqlFile
)

if (-not (Test-Path $SqlFile)) {
  Write-Error "SQL file not found: $SqlFile"
  exit 1
}

$content = Get-Content -Path $SqlFile -Raw

# Block clearly destructive operations.
$patterns = @(
  '(?im)^\s*DROP\s+(TABLE|SCHEMA|DATABASE|INDEX)\b',
  '(?im)^\s*TRUNCATE\b',
  '(?im)^\s*DELETE\s+FROM\b',
  '(?im)^\s*ALTER\s+TABLE\b.*\bDROP\s+COLUMN\b'
)

$violations = @()
foreach ($pattern in $patterns) {
  if ($content -match $pattern) {
    $violations += $pattern
  }
}

if ($violations.Count -gt 0) {
  Write-Host "Blocked: destructive SQL detected in $SqlFile" -ForegroundColor Red
  $violations | ForEach-Object { Write-Host "Matched rule: $_" -ForegroundColor Yellow }
  exit 2
}

Write-Host "OK: no destructive SQL operations detected in $SqlFile" -ForegroundColor Green
exit 0
