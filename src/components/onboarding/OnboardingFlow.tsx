"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Save, Sparkles } from "lucide-react";

import { buildCallingMockDraft, reviewCallingDraftSafety, type CallingDraft } from "@/ai/schemas/calling";
import { analyzeLifeMap, lifeMapAreas } from "@/domain/life-map";
import {
  aiSupportToneOptions,
  callingQuestions,
  christianLayerOptions,
  energyOptions,
  getProgressiveUnlockState,
  type CallingAnswers,
  type LifeMapAreaInput,
  type ProfileEssentialInput
} from "@/domain/onboarding";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Slider } from "@/components/ui/Slider";
import { Stepper } from "@/components/ui/Stepper";
import { Textarea } from "@/components/ui/Textarea";
import { Toast } from "@/components/ui/Toast";
import { saveOnboarding, type SaveOnboardingResult } from "@/app/onboarding/actions";

const emptyProfile: ProfileEssentialInput = {
  name: "",
  occupation: "",
  currentRoutine: "",
  mainResponsibilities: "",
  mainDifficulty: "",
  focusRelationship: "",
  habitualEnergy: "variable",
  disorderAreas: "",
  faithRelationship: "",
  familyContext: "",
  platformExpectation: "",
  aiSupportTone: "balanced",
  christianLayerPreference: "balanced"
};

const emptyCallingAnswers = callingQuestions.reduce((acc, question) => {
  acc[question.key] = "";
  return acc;
}, {} as CallingAnswers);

const defaultLifeMap = lifeMapAreas.map((area) => ({
  areaSlug: area.slug,
  score: 5,
  note: ""
})) satisfies LifeMapAreaInput[];

const stepLabels = ["Boas-vindas", "Perfil", "Mapa da Vida", "Chamado", "Resumo"];

type StepIndex = 0 | 1 | 2 | 3 | 4;

function stepStatus(index: number, currentStep: number) {
  if (index < currentStep) {
    return "done";
  }

  if (index === currentStep) {
    return "current";
  }

  return "upcoming";
}

function textList(items: string[]) {
  if (items.length === 0) {
    return "Em aberto";
  }

  return items.join(", ");
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [profile, setProfile] = useState<ProfileEssentialInput>(emptyProfile);
  const [lifeMap, setLifeMap] = useState<LifeMapAreaInput[]>(defaultLifeMap);
  const [callingAnswers, setCallingAnswers] = useState<CallingAnswers>(emptyCallingAnswers);
  const [callingDraft, setCallingDraft] = useState<CallingDraft | null>(null);
  const [acceptedCallingDraft, setAcceptedCallingDraft] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveOnboardingResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const completionPercent = Math.round((currentStep / (stepLabels.length - 1)) * 100);
  const lifeMapAnalysis = useMemo(() => analyzeLifeMap(lifeMap), [lifeMap]);
  const unlockState = getProgressiveUnlockState({
    hasCallingHypothesis: Boolean(callingDraft?.calling_hypothesis || acceptedCallingDraft)
  });

  function goToStep(nextStep: StepIndex) {
    setCurrentStep(nextStep);
    setSaveResult(null);
  }

  function nextStep() {
    setCurrentStep((step) => Math.min(step + 1, 4) as StepIndex);
    setSaveResult(null);
  }

  function previousStep() {
    setCurrentStep((step) => Math.max(step - 1, 0) as StepIndex);
    setSaveResult(null);
  }

  function updateProfile<K extends keyof ProfileEssentialInput>(key: K, value: ProfileEssentialInput[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function updateLifeMap(areaSlug: LifeMapAreaInput["areaSlug"], patch: Partial<LifeMapAreaInput>) {
    setLifeMap((current) =>
      current.map((item) => (item.areaSlug === areaSlug ? { ...item, ...patch } : item))
    );
  }

  function generateCallingDraft() {
    const draft = buildCallingMockDraft({
      answers: callingAnswers,
      lifeMapObservations: lifeMapAnalysis.careAlerts
    });
    const safety = reviewCallingDraftSafety(draft);

    if (!safety.allowed) {
      setSaveResult({
        mode: "local-draft",
        ok: false,
        message: safety.nextSafeStep
      });
      return;
    }

    setCallingDraft(draft);
    setAcceptedCallingDraft(false);
    setSaveResult({
      mode: "local-draft",
      ok: true,
      message: "Mock seguro gerou uma hipotese revisavel. Nenhuma chamada real de IA foi feita."
    });
  }

  function handleSave() {
    if (!callingDraft) {
      setSaveResult({
        mode: "local-draft",
        ok: true,
        message: "Rascunho mantido nesta sessao. Gere uma hipotese antes de salvar o Chamado."
      });
      return;
    }

    startTransition(async () => {
      const result = await saveOnboarding({
        profile,
        lifeMap,
        callingAnswers,
        callingDraft,
        acceptedCallingDraft
      });

      setSaveResult(result);
    });
  }

  return (
    <div className="space-y-6" data-testid="onboarding-flow">
      <Stepper
        steps={stepLabels.map((label, index) => ({
          label,
          status: stepStatus(index, currentStep),
          description:
            index === 0
              ? "Direcao antes de agenda"
              : index === 4
                ? "Revisao segura"
                : "Salvavel e retomavel"
        }))}
      />

      <Progress label="Progresso do onboarding" value={completionPercent} />

      {saveResult ? (
        <Toast title={saveResult.mode === "supabase" ? "Salvo com Supabase" : "Modo seguro local"}>
          {saveResult.message}
        </Toast>
      ) : null}

      {currentStep === 0 ? (
        <WelcomeStep onStart={() => goToStep(1)} />
      ) : currentStep === 1 ? (
        <ProfileStep profile={profile} updateProfile={updateProfile} />
      ) : currentStep === 2 ? (
        <LifeMapStep analysis={lifeMapAnalysis} lifeMap={lifeMap} updateLifeMap={updateLifeMap} />
      ) : currentStep === 3 ? (
        <CallingStep
          callingAnswers={callingAnswers}
          callingDraft={callingDraft}
          generateCallingDraft={generateCallingDraft}
          setAcceptedCallingDraft={setAcceptedCallingDraft}
          setCallingAnswers={setCallingAnswers}
          setCallingDraft={setCallingDraft}
        />
      ) : (
        <SummaryStep
          acceptedCallingDraft={acceptedCallingDraft}
          callingDraft={callingDraft}
          lifeMapAnalysis={lifeMapAnalysis}
          profile={profile}
          unlockState={unlockState}
        />
      )}

      {currentStep > 0 ? (
        <div className="flex flex-col gap-3 border-t border-ink-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            className="w-full sm:w-auto"
            disabled={currentStep === 0}
            onClick={previousStep}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" disabled={isPending} onClick={handleSave} variant="soft">
              <Save aria-hidden="true" className="h-4 w-4" />
              Salvar e continuar depois
            </Button>
            {currentStep < 4 ? (
              <Button className="w-full sm:w-auto" onClick={nextStep}>
                Continuar
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="w-full sm:w-auto" disabled={isPending} onClick={handleSave}>
                <Check aria-hidden="true" className="h-4 w-4" />
                Salvar jornada
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-4">
        <div className="rounded-panel border border-purpose-100 bg-purpose-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-purpose-700">
            Proposito em Acao
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink-900">
            Antes de organizar sua agenda, vamos entender sua direcao.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-700">
            Este fluxo cria um perfil essencial, um Mapa da Vida e uma hipotese provisoria
            de Chamado. Nada aqui e sentenca final: e discernimento pratico para voce dar
            o proximo passo com menos ruido.
          </p>
          <Button className="mt-5" onClick={onStart} size="lg">
            Iniciar
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
        <SensitiveDataNotice>
          Fe, familia, saude, emocoes, rotina e Chamado sao privados por padrao. Nesta etapa,
          mock e fallback local nao enviam dados para OpenAI.
        </SensitiveDataNotice>
      </div>
      <Card as="aside">
        <h3 className="font-bold text-ink-900">Versao minima</h3>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          Em dia de baixa energia, responda apenas nome, uma nota geral no Mapa e uma frase
          de direcao. Voce pode amadurecer depois.
        </p>
      </Card>
    </section>
  );
}

function ProfileStep({
  profile,
  updateProfile
}: {
  profile: ProfileEssentialInput;
  updateProfile: <K extends keyof ProfileEssentialInput>(key: K, value: ProfileEssentialInput[K]) => void;
}) {
  return (
    <section className="space-y-5" aria-labelledby="perfil-title">
      <div>
        <h2 className="text-xl font-bold text-ink-900" id="perfil-title">
          Perfil essencial
        </h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Responda o suficiente para personalizar a jornada. Campos longos podem ficar para depois.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome de exibicao" htmlFor="profile-name">
          <Input
            id="profile-name"
            onChange={(event) => updateProfile("name", event.target.value)}
            placeholder="Como voce quer ser chamado?"
            value={profile.name}
          />
        </Field>
        <Field label="Ocupacao/profissao" htmlFor="profile-occupation">
          <Input
            id="profile-occupation"
            onChange={(event) => updateProfile("occupation", event.target.value)}
            placeholder="Ex.: professor, empreendedor, estudante"
            value={profile.occupation}
          />
        </Field>
        <Field label="Rotina atual" htmlFor="profile-routine">
          <Textarea
            id="profile-routine"
            onChange={(event) => updateProfile("currentRoutine", event.target.value)}
            placeholder="Um retrato simples do seu dia comum."
            value={profile.currentRoutine}
          />
        </Field>
        <Field label="Principais responsabilidades" htmlFor="profile-responsibilities">
          <Textarea
            id="profile-responsibilities"
            onChange={(event) => updateProfile("mainResponsibilities", event.target.value)}
            placeholder="Trabalho, casa, familia, estudos, igreja, cuidado..."
            value={profile.mainResponsibilities}
          />
        </Field>
        <Field label="Dificuldade principal hoje" htmlFor="profile-difficulty">
          <Textarea
            id="profile-difficulty"
            onChange={(event) => updateProfile("mainDifficulty", event.target.value)}
            placeholder="O que mais drena clareza ou constancia?"
            value={profile.mainDifficulty}
          />
        </Field>
        <Field label="Foco e procrastinacao" htmlFor="profile-focus">
          <Textarea
            id="profile-focus"
            onChange={(event) => updateProfile("focusRelationship", event.target.value)}
            placeholder="Como isso aparece na pratica?"
            value={profile.focusRelationship}
          />
        </Field>
        <Field label="Areas de maior desordem" htmlFor="profile-disorder">
          <Input
            id="profile-disorder"
            onChange={(event) => updateProfile("disorderAreas", event.target.value)}
            placeholder="Ex.: sono, finanças, trabalho, casa"
            value={profile.disorderAreas}
          />
        </Field>
        <Field label="Familia/contexto de responsabilidades" htmlFor="profile-family">
          <Input
            id="profile-family"
            onChange={(event) => updateProfile("familyContext", event.target.value)}
            placeholder="Opcional e no seu nivel de conforto."
            value={profile.familyContext}
          />
        </Field>
        <Field label="Relacao com fe" htmlFor="profile-faith">
          <Input
            id="profile-faith"
            onChange={(event) => updateProfile("faithRelationship", event.target.value)}
            placeholder="Opcional. Pode responder depois."
            value={profile.faithRelationship}
          />
        </Field>
        <Field label="Expectativa com a plataforma" htmlFor="profile-expectation">
          <Input
            id="profile-expectation"
            onChange={(event) => updateProfile("platformExpectation", event.target.value)}
            placeholder="O que seria util nas proximas semanas?"
            value={profile.platformExpectation}
          />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RadioGroup
          legend="Energia habitual"
          name="habitualEnergy"
          onChange={(event) => updateProfile("habitualEnergy", event.currentTarget.value as ProfileEssentialInput["habitualEnergy"])}
          options={energyOptions}
          value={profile.habitualEnergy}
        />
        <RadioGroup
          legend="Suporte da IA"
          name="aiSupportTone"
          onChange={(event) => updateProfile("aiSupportTone", event.currentTarget.value as ProfileEssentialInput["aiSupportTone"])}
          options={aiSupportToneOptions}
          value={profile.aiSupportTone}
        />
        <RadioGroup
          legend="Camada crista"
          name="christianLayerPreference"
          onChange={(event) => updateProfile("christianLayerPreference", event.currentTarget.value as ProfileEssentialInput["christianLayerPreference"])}
          options={christianLayerOptions}
          value={profile.christianLayerPreference}
        />
      </div>
    </section>
  );
}

function LifeMapStep({
  analysis,
  lifeMap,
  updateLifeMap
}: {
  analysis: ReturnType<typeof analyzeLifeMap>;
  lifeMap: LifeMapAreaInput[];
  updateLifeMap: (areaSlug: LifeMapAreaInput["areaSlug"], patch: Partial<LifeMapAreaInput>) => void;
}) {
  return (
    <section className="space-y-5" aria-labelledby="life-map-title">
      <div>
        <h2 className="text-xl font-bold text-ink-900" id="life-map-title">
          Mapa da Vida
        </h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Nota de 1 a 10, observacao opcional. O feedback e convite de cuidado, nao julgamento.
        </p>
      </div>

      <SensitiveDataNotice>
        Voce pode deixar observacoes em branco. Areas como fe, familia, saude, financas e emocoes
        sao sensiveis e continuam privadas por padrao.
      </SensitiveDataNotice>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-3 md:grid-cols-2">
          {lifeMapAreas.map((area) => {
            const item = lifeMap.find((score) => score.areaSlug === area.slug)!;
            return (
              <Card as="section" key={area.slug}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink-900">{area.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-600">{area.prompt}</p>
                  </div>
                  <span className="rounded-full bg-ink-50 px-2 py-1 text-sm font-bold text-ink-900">
                    {item.score}/10
                  </span>
                </div>
                <div className="mt-4">
                  <Slider
                    label={`Nota de ${area.name}`}
                    max={10}
                    min={1}
                    onChange={(event) => updateLifeMap(area.slug, { score: Number(event.target.value) })}
                    value={item.score}
                  />
                </div>
                <Textarea
                  aria-label={`Observacao opcional sobre ${area.name}`}
                  className="mt-3 min-h-20"
                  onChange={(event) => updateLifeMap(area.slug, { note: event.target.value })}
                  placeholder="Observacao opcional"
                  value={item.note ?? ""}
                />
              </Card>
            );
          })}
        </div>
        <Card as="aside" className="h-fit">
          <h3 className="font-bold text-ink-900">Leitura inicial</h3>
          <p className="mt-2 text-sm text-ink-600">Media atual: {analysis.averageScore}/10</p>
          <SummaryList title="Fortes" value={textList(analysis.strongAreas)} />
          <SummaryList title="Pedem cuidado" value={textList(analysis.fragileAreas)} />
          <SummaryList title="Nao sacrificar" value={textList(analysis.doNotSacrifice)} />
          <p className="mt-4 text-sm leading-6 text-ink-600">{analysis.careAlerts[0]}</p>
        </Card>
      </div>
    </section>
  );
}

function CallingStep({
  callingAnswers,
  callingDraft,
  generateCallingDraft,
  setAcceptedCallingDraft,
  setCallingAnswers,
  setCallingDraft
}: {
  callingAnswers: CallingAnswers;
  callingDraft: CallingDraft | null;
  generateCallingDraft: () => void;
  setAcceptedCallingDraft: (value: boolean) => void;
  setCallingAnswers: (value: CallingAnswers) => void;
  setCallingDraft: (value: CallingDraft) => void;
}) {
  return (
    <section className="space-y-5" aria-labelledby="calling-title">
      <div>
        <h2 className="text-xl font-bold text-ink-900" id="calling-title">
          Chamado Pessoal em discernimento
        </h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Responda como rascunho. A hipotese sera editavel e nao afirma vontade divina especifica.
        </p>
      </div>

      <SensitiveDataNotice title="Chamado privado por padrao">
        Nada aqui e enviado ao Atalaia. O mock desta etapa usa apenas as respostas na tela e nao chama
        a OpenAI real.
      </SensitiveDataNotice>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-3">
          {callingQuestions.map((question) => (
            <Field htmlFor={`calling-${question.key}`} key={question.key} label={question.label}>
              <Textarea
                id={`calling-${question.key}`}
                onChange={(event) =>
                  setCallingAnswers({ ...callingAnswers, [question.key]: event.target.value })
                }
                placeholder={question.helper}
                value={callingAnswers[question.key]}
              />
            </Field>
          ))}
        </div>
        <aside className="space-y-4">
          <Card as="section">
            <h3 className="font-bold text-ink-900">Hipotese provisoria</h3>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Gere uma primeira sintese. Voce pode editar antes de aceitar como hipotese.
            </p>
            <Button className="mt-4 w-full" onClick={generateCallingDraft} variant="soft">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Gerar hipotese segura
            </Button>
          </Card>

          {callingDraft ? (
            <Card as="section" className="border-purpose-100 bg-purpose-50">
              <Field htmlFor="calling-hypothesis" label="Hipotese editavel">
                <Textarea
                  id="calling-hypothesis"
                  onChange={(event) =>
                    setCallingDraft({
                      ...callingDraft,
                      calling_hypothesis: event.target.value
                    })
                  }
                  value={callingDraft.calling_hypothesis}
                />
              </Field>
              <Field htmlFor="calling-direction" label="Frase provisoria de direcao">
                <Textarea
                  id="calling-direction"
                  onChange={(event) =>
                    setCallingDraft({
                      ...callingDraft,
                      direction_statement: event.target.value
                    })
                  }
                  value={callingDraft.direction_statement}
                />
              </Field>
              <p className="mt-3 text-xs leading-5 text-purpose-900">{callingDraft.pastoral_safety_note}</p>
              <Button className="mt-4 w-full" onClick={() => setAcceptedCallingDraft(true)}>
                <Check aria-hidden="true" className="h-4 w-4" />
                Aceitar como hipotese provisoria
              </Button>
            </Card>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function SummaryStep({
  acceptedCallingDraft,
  callingDraft,
  lifeMapAnalysis,
  profile,
  unlockState
}: {
  acceptedCallingDraft: boolean;
  callingDraft: CallingDraft | null;
  lifeMapAnalysis: ReturnType<typeof analyzeLifeMap>;
  profile: ProfileEssentialInput;
  unlockState: ReturnType<typeof getProgressiveUnlockState>;
}) {
  return (
    <section className="space-y-5" aria-labelledby="summary-title">
      <div>
        <h2 className="text-xl font-bold text-ink-900" id="summary-title">
          Dashboard inicial da jornada
        </h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Este e o estado inicial de direcao. Agenda, alvos completos e Atalaia ficam para etapas futuras.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section" className="border-purpose-100 bg-purpose-50">
          <h3 className="font-bold text-ink-900">Direcao de {profile.name || "usuario"}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {callingDraft?.direction_statement ?? "Chamado ainda pendente. Salve uma hipotese para avancar."}
          </p>
          <p className="mt-3 text-xs font-semibold text-purpose-900">
            Status: {acceptedCallingDraft ? "hipotese aceita" : callingDraft ? "hipotese em revisao" : "pendente"}
          </p>
        </Card>
        <Card as="section">
          <h3 className="font-bold text-ink-900">Resumo do Mapa</h3>
          <SummaryList title="Media" value={`${lifeMapAnalysis.averageScore}/10`} />
          <SummaryList title="Areas fortes" value={textList(lifeMapAnalysis.strongAreas)} />
          <SummaryList title="Cuidado agora" value={textList(lifeMapAnalysis.fragileAreas)} />
        </Card>
        <Card as="section">
          <h3 className="font-bold text-ink-900">Proxima etapa recomendada</h3>
          <p className="mt-2 text-sm leading-6 text-ink-600">{unlockState.nextRecommendedStep}</p>
          <p className="mt-3 text-sm leading-6 text-ink-600">{unlockState.message}</p>
        </Card>
        <Card as="section">
          <h3 className="font-bold text-ink-900">Progressao assistida</h3>
          <SummaryList title="Liberado" value={textList(unlockState.availableModules)} />
          <SummaryList title="Limitado por enquanto" value={textList(unlockState.limitedModules)} />
        </Card>
      </div>
    </section>
  );
}

function Field({
  children,
  htmlFor,
  label
}: {
  children: ReactNode;
  htmlFor: string;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink-900" htmlFor={htmlFor}>
      {label}
      {children}
    </label>
  );
}

function SummaryList({ title, value }: { title: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{title}</p>
      <p className="mt-1 text-sm leading-6 text-ink-800">{value}</p>
    </div>
  );
}
