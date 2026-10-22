# Cuerpo de la mutación a Sanity (módulo HTTP, paso 8)
```json
{ "mutations": [ { "createIfNotExists": {
  "_id": "drafts.post-{{slug}}", "_type": "post",
  "title": "{{titulo}}", "slug": {"_type":"slug","current":"{{slug}}"},
  "excerpt": "{{metadescripcion}}", "source": "make-ia",
  "sources": ["{{url_fuente_1}}"],
  "seo": {"title":"{{titulo_seo}}","description":"{{metadescripcion}}"},
  "body": [ /* bloques portable text */ ]
} } ] }
```
Cabecera: `Authorization: Bearer <token en la conexión de Make>`. Nunca incluir `publishedAt`: lo fija el editor al publicar.
Prompt de IA: incluir "No incluyas datos personales ni casos reales; cita solo las fuentes proporcionadas; marca como [VERIFICAR] toda afirmación sin fuente".
