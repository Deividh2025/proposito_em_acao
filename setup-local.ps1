# Interactive setup script for Propósito em Ação personal local use.

Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Configuracao Local - Proposito em Acao" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$supabaseUrl = Read-Host "1. Digite a URL do seu projeto Supabase (ex: https://xxxx.supabase.co)"
$supabaseAnonKey = Read-Host "2. Digite a Anon public key (ou Publishable Key) do seu Supabase"
$supabaseServiceRole = Read-Host "3. Digite a Service Role key (ou Secret Key) do seu Supabase"
$supabaseProjectId = Read-Host "4. Digite o Project Ref/ID do seu Supabase (20 caracteres)"
$deepseekApiKey = Read-Host "5. (Opcional) Digite a sua API Key do DeepSeek (ou pressione Enter para pular)"

# Calculate AI enabled state in a way compatible with all PowerShell versions
$aiEnabled = "false"
if ($deepseekApiKey -ne "") {
    $aiEnabled = "true"
}

# Generate .env.local
$envContent = @"
# App
NEXT_PUBLIC_APP_NAME="Propósito em Ação"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BETA_FEEDBACK_URL=""

# Supabase
NEXT_PUBLIC_SUPABASE_URL="$supabaseUrl"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$supabaseAnonKey"
NEXT_PUBLIC_SUPABASE_ANON_KEY="$supabaseAnonKey"
SUPABASE_SERVICE_ROLE_KEY="$supabaseServiceRole"
SUPABASE_PROJECT_ID="$supabaseProjectId"

# Runtime
APP_RUNTIME_MODE="preview"
AI_REAL_ENABLED="$aiEnabled"
EMAIL_REAL_ENABLED="false"
EMAIL_DOMAIN_VERIFIED="false"
ANALYTICS_REAL_ENABLED="false"
FEEDBACK_REAL_ENABLED="false"

# AI providers
AI_PROVIDER_DEFAULT="deepseek"
AI_REQUEST_TIMEOUT_MS="20000"
AI_DAILY_USER_LIMIT="50"
AI_AUDIT_RETENTION_DAYS="90"
DEEPSEEK_API_KEY="$deepseekApiKey"
DEEPSEEK_BASE_URL="https://api.deepseek.com"
DEEPSEEK_MODEL_FLASH="deepseek-ai/deepseek-v4-pro"
DEEPSEEK_MODEL_PRO="deepseek-ai/deepseek-v4-pro"

# Node environment
NODE_ENV="development"
"@

# Write .env.local using UTF-8 without BOM to avoid character parsing errors (like the BOM '»' issue)
$utf8NoBom = New-Object System.Text.UTF8Encoding $False
$filePath = Join-Path (Get-Location) ".env.local"
[System.IO.File]::WriteAllText($filePath, $envContent, $utf8NoBom)

Write-Host ""
Write-Host "[OK] Arquivo .env.local criado com sucesso (UTF-8 sem BOM)!" -ForegroundColor Green
Write-Host ""

$dbUrl = Read-Host "6. (Opcional) Para aplicar as migrations de banco de dados automaticamente, digite a sua Connection String (URI) do banco (ex: postgresql://postgres.xxxx:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres) ou pressione Enter para pular"

if ($dbUrl -ne "") {
    Write-Host "Aplicando migrations no banco de dados do Supabase... Aguarde." -ForegroundColor Yellow
    # Add Node/git path if not globally present
    $env:PATH += ";C:\Program Files\nodejs;C:\Users\user\PortableGit\cmd"
    npx.cmd supabase db push --db-url "$dbUrl"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Migrations aplicadas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "[ERRO] Falha ao aplicar migrations. Verifique a Connection String e a conexao de internet." -ForegroundColor Red
    }
} else {
    Write-Host "Migrations puladas. Lembre-se de executa-las manualmente no SQL Editor do painel do Supabase." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Configuracao concluida!" -ForegroundColor Green
Write-Host "Para rodar a plataforma localmente, execute o comando:" -ForegroundColor Cyan
Write-Host "  npm.cmd run dev" -ForegroundColor Yellow
Write-Host ""
