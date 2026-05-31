import { expect, test } from "@playwright/test";

test("user can complete onboarding with safe mock and reach initial dashboard state", async ({ page }) => {
  await page.goto("/onboarding");

  await expect(page.getByRole("heading", { name: "Onboarding e direção" })).toBeVisible();
  await page.getByRole("button", { name: "Iniciar" }).click();

  await page.getByLabel("Nome de exibicao").fill("Davi");
  await page.getByLabel("Ocupacao/profissao").fill("Fundador");
  await page.getByLabel("Rotina atual").fill("Rotina cheia, com muitas demandas e pouca clareza.");
  await page.getByLabel("Principais responsabilidades").fill("Familia, trabalho e igreja.");
  await page.getByLabel("Dificuldade principal hoje").fill("Comecar o que importa primeiro.");
  await page.getByLabel("Foco e procrastinacao").fill("Alterno entre hiperfoco e travamento.");
  await page.getByLabel("Areas de maior desordem").fill("Sono e planejamento.");
  await page.getByLabel("Familia/contexto de responsabilidades").fill("Responsabilidades familiares reais.");
  await page.getByLabel("Relacao com fe").fill("Crista, buscando constancia.");
  await page.getByLabel("Expectativa com a plataforma").fill("Clareza e proxima acao.");
  await page.getByLabel("Oscilante").check();
  await page.getByLabel("Equilibrado").check();
  await page.getByLabel("Equilibrada").check();
  await page.getByRole("button", { exact: true, name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Mapa da Vida" })).toBeVisible();
  await page.getByLabel("Nota de Fe e espiritualidade").fill("8");
  await page.getByLabel("Nota de Saude e energia").fill("3");
  await page.getByLabel("Nota de Descanso").fill("2");
  await page.getByLabel("Observacao opcional sobre Saude e energia").fill("Energia baixa e sono irregular.");
  await expect(page.getByText("pede cuidado simples", { exact: false })).toBeVisible();
  await page.getByRole("button", { exact: true, name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Chamado Pessoal em discernimento" })).toBeVisible();
  await page.getByLabel("O que mais te incomoda no mundo hoje?").fill("Familias sem direcao.");
  await page.getByLabel("Que dor voce sente vontade de ajudar a resolver?").fill("Confusao virando paralisia.");
  await page.getByLabel("Quem voce deseja ajudar com mais intencao?").fill("Pais jovens e lideres cansados.");
  await page.getByLabel("Como voce gostaria de ser lembrado?").fill("Como alguem fiel e pratico.");
  await page.getByLabel("Quais experiencias marcaram sua vida?").fill("Recomecos depois de fases dificeis.");
  await page.getByLabel("Quais dons, talentos ou inclinacoes aparecem de novo e de novo?").fill("Escuta, ensino e organizacao.");
  await page.getByLabel("Quais valores sao inegociaveis para voce?").fill("Fidelidade, familia, servico.");
  await page.getByLabel("Onde voce sente responsabilidade?").fill("Na formacao de pessoas.");
  await page.getByLabel("O que faria sua vida parecer frutifera?").fill("Ver pessoas andando com clareza.");
  await page.getByLabel("Que contribuicao voce deseja discernir diante de Deus?").fill("Servir sem pressa e sem culpa.");
  await page.getByRole("button", { name: "Gerar hipotese segura" }).click();
  await expect(page.getByText("Mock seguro gerou uma hipotese revisavel")).toBeVisible();
  await page.getByRole("button", { name: "Aceitar como hipotese provisoria" }).click();
  await page.getByRole("button", { exact: true, name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Dashboard inicial da jornada" })).toBeVisible();
  await expect(page.getByText("hipotese aceita")).toBeVisible();
  await expect(page.getByText("Progressao assistida")).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Sua direção agora" })).toBeVisible();
  await expect(page.getByText("Direção antes de agenda")).toBeVisible();
});
