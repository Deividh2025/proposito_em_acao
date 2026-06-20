# setup-mcp.ps1
# Script interativo para configurar os servidores MCP no Antigravity sem precisar editar código manualmente.

$configPath = "C:\Users\user\.gemini\config\mcp_config.json"
$configDir = Split-Path $configPath

if (!(Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

# Carregar configuração existente ou criar uma nova
if (Test-Path $configPath) {
    try {
        $jsonContent = Get-Content $configPath -Raw -ErrorAction Stop
        $config = ConvertFrom-Json $jsonContent -ErrorAction Stop
    } catch {
        Write-Host "Aviso: Não foi possível ler o arquivo mcp_config.json atual. Criando um novo." -ForegroundColor Yellow
        $config = [PSCustomObject]@{ mcpServers = [PSCustomObject]@{} }
    }
} else {
    $config = [PSCustomObject]@{ mcpServers = [PSCustomObject]@{} }
}

# Garantir que mcpServers esteja inicializado
if (!$config.mcpServers) {
    $config | Add-Member -MemberType NoteProperty -Name mcpServers -Value ([PSCustomObject]@{}) -Force
}

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Configurador Interativo de Servidores MCP   " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Pressione [Enter] sem digitar nada para manter a configuração atual ou pular.`n" -ForegroundColor Gray

# --- CONFIGURAÇÃO GITHUB ---
Write-Host "[1/4] Configuração do GitHub" -ForegroundColor Green
$currentGithubToken = ""
if ($config.mcpServers.github -and $config.mcpServers.github.env) {
    $currentGithubToken = $config.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN
}
if (![string]::IsNullOrWhiteSpace($currentGithubToken)) {
    Write-Host "Token atual: ******** (já configurado)" -ForegroundColor Gray
} else {
    Write-Host "Token atual: (não configurado)" -ForegroundColor Gray
}
$githubToken = Read-Host "Digite o seu Personal Access Token (PAT) do GitHub"
if ([string]::IsNullOrWhiteSpace($githubToken)) {
    $githubToken = $currentGithubToken
}

if (![string]::IsNullOrWhiteSpace($githubToken)) {
    # Inicializa o objeto github se não existir
    if (!$config.mcpServers.github) {
        $config.mcpServers | Add-Member -MemberType NoteProperty -Name github -Value ([PSCustomObject]@{}) -Force
    }
    $config.mcpServers.github = [PSCustomObject]@{
        command = "npx"
        args = @("-y", "@modelcontextprotocol/server-github")
        env = [PSCustomObject]@{
            GITHUB_PERSONAL_ACCESS_TOKEN = $githubToken
        }
    }
}

# --- CONFIGURAÇÃO POSTGRES ---
Write-Host "`n[2/4] Configuração do Postgres" -ForegroundColor Green
$currentPostgresUrl = ""
if ($config.mcpServers.postgres -and $config.mcpServers.postgres.args) {
    $currentPostgresUrl = $config.mcpServers.postgres.args[2]
}
if (![string]::IsNullOrWhiteSpace($currentPostgresUrl)) {
    Write-Host "URL atual: $currentPostgresUrl" -ForegroundColor Gray
} else {
    Write-Host "URL atual: (não configurada)" -ForegroundColor Gray
}
$postgresUrl = Read-Host "Digite a URL de conexão do Postgres (ex: postgresql://user:pass@host:port/db)"
if ([string]::IsNullOrWhiteSpace($postgresUrl)) {
    $postgresUrl = $currentPostgresUrl
}

if (![string]::IsNullOrWhiteSpace($postgresUrl)) {
    if (!$config.mcpServers.postgres) {
        $config.mcpServers | Add-Member -MemberType NoteProperty -Name postgres -Value ([PSCustomObject]@{}) -Force
    }
    $config.mcpServers.postgres = [PSCustomObject]@{
        command = "npx"
        args = @("-y", "@modelcontextprotocol/server-postgres", $postgresUrl)
    }
}

# --- CONFIGURAÇÃO SUPABASE SELF-HOSTED (COOLIFY) ---
Write-Host "`n[3/4] Configuração do Supabase Self-Hosted (Coolify)" -ForegroundColor Green
$currentSupaUrl = ""
$currentSupaAnon = ""
$currentSupaService = ""
if ($config.mcpServers.'supabase-selfhosted' -and $config.mcpServers.'supabase-selfhosted'.args) {
    $argsList = $config.mcpServers.'supabase-selfhosted'.args
    $currentSupaUrl = $argsList[3]
    $currentSupaAnon = $argsList[5]
    $currentSupaService = $argsList[7]
}

if (![string]::IsNullOrWhiteSpace($currentSupaUrl)) {
    Write-Host "URL Supabase atual: $currentSupaUrl" -ForegroundColor Gray
} else {
    Write-Host "URL Supabase atual: (não configurada)" -ForegroundColor Gray
}
$supaUrl = Read-Host "Digite a URL do seu Supabase Self-Hosted"
if ([string]::IsNullOrWhiteSpace($supaUrl)) { $supaUrl = $currentSupaUrl }

if (![string]::IsNullOrWhiteSpace($currentSupaAnon)) {
    Write-Host "Anon Key atual: ******** (já configurada)" -ForegroundColor Gray
}
$supaAnon = Read-Host "Digite a Anon Key do seu Supabase"
if ([string]::IsNullOrWhiteSpace($supaAnon)) { $supaAnon = $currentSupaAnon }

if (![string]::IsNullOrWhiteSpace($currentSupaService)) {
    Write-Host "Service Role Key atual: ******** (já configurada)" -ForegroundColor Gray
}
$supaService = Read-Host "Digite a Service Role Key do seu Supabase"
if ([string]::IsNullOrWhiteSpace($supaService)) { $supaService = $currentSupaService }

if (![string]::IsNullOrWhiteSpace($supaUrl) -and ![string]::IsNullOrWhiteSpace($supaAnon) -and ![string]::IsNullOrWhiteSpace($supaService)) {
    if (!$config.mcpServers.'supabase-selfhosted') {
        $config.mcpServers | Add-Member -MemberType NoteProperty -Name 'supabase-selfhosted' -Value ([PSCustomObject]@{}) -Force
    }
    $config.mcpServers.'supabase-selfhosted' = [PSCustomObject]@{
        command = "npx"
        args = @("-y", "@lemontreen/rds-supabase-mcp-server", "--url", $supaUrl, "--anon-key", $supaAnon, "--service-key", $supaService)
    }
}

# --- CONFIGURAÇÃO SUPABASE CLOUD ---
Write-Host "`n[4/4] Configuração do Supabase Cloud (Oficial)" -ForegroundColor Green
$currentSupaCloudToken = ""
if ($config.mcpServers.'supabase-cloud' -and $config.mcpServers.'supabase-cloud'.args) {
    $currentSupaCloudToken = $config.mcpServers.'supabase-cloud'.args[3]
}
if (![string]::IsNullOrWhiteSpace($currentSupaCloudToken)) {
    Write-Host "Token Supabase Cloud atual: ******** (já configurado)" -ForegroundColor Gray
} else {
    Write-Host "Token Supabase Cloud atual: (não configurado)" -ForegroundColor Gray
}
$supaCloudToken = Read-Host "Digite o seu Personal Access Token do Supabase Cloud"
if ([string]::IsNullOrWhiteSpace($supaCloudToken)) {
    $supaCloudToken = $currentSupaCloudToken
}

if (![string]::IsNullOrWhiteSpace($supaCloudToken)) {
    if (!$config.mcpServers.'supabase-cloud') {
        $config.mcpServers | Add-Member -MemberType NoteProperty -Name 'supabase-cloud' -Value ([PSCustomObject]@{}) -Force
    }
    $config.mcpServers.'supabase-cloud' = [PSCustomObject]@{
        command = "npx"
        args = @("-y", "@supabase/mcp-server-supabase@latest", "--access-token", $supaCloudToken)
    }
}

# Salvar arquivo JSON com profundidade apropriada para evitar truncamento
try {
    $newJson = ConvertTo-Json $config -Depth 10
    Set-Content -Path $configPath -Value $newJson -Force -ErrorAction Stop
    Write-Host "`n[SUCESSO] Configuração salva em: $configPath" -ForegroundColor Green
    Write-Host "Por favor, reinicie o Antigravity para carregar as novas credenciais e servidores MCP." -ForegroundColor Cyan
} catch {
    Write-Host "`n[ERRO] Não foi possível salvar a configuração: $_" -ForegroundColor Red
}
