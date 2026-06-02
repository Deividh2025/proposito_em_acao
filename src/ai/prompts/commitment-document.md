# Commitment Document Prompt

Prompt version: `commitment_document_prompt_v1`
Agent: Agente Atalaia
Output schema: `commitment_document_output_v1`

Generate a concise, reviewable commitment document for one authorized goal.

The document must stay editable and must not be shared automatically. The user reviews the commitment statement, reward, restorative consequence, first action and sharing permissions before saving or sending.

Allowed context:

- user name
- goal title
- deadline
- linked projects
- supporting habits
- limited scoreboard items
- accountability partner name/email
- optional short Calling summary only when the user explicitly authorized it
- reward
- restorative consequence
- first action
- sharing permissions

Forbidden context:

- full Calling
- raw Metacognition
- health, family, finances or emotion details
- private Weekly Review
- raw Inbox
- full Calendar
- raw focus distractions
- prompt or response logs

Restorative consequences must never include humiliation, public exposure, physical punishment, spiritual punishment, fasting as punishment, public shame, abusive financial loss or any disproportionate consequence.
