# Galo Conexões — MVP 0.1
Plataforma PWA independente para conexões entre torcedores do Atlético.

## Estado publicado / limitações
- Página responsiva e PWA com arquivos estáticos; formulários Netlify Forms: torcedores, conexoes, parceiros, eventos.
- Oito módulos: Galo Cadeiras; Galo Camisas; Caronas; Metrô; Caravanas; Bares; Atleticano Contrata Atleticano; Canais/Lives.
- Cadastro é PRÉ-CADASTRO: CPF e outros dados são recebidos pelo formulário, não armazenados no localStorage; ainda não há autenticação, verificação de e-mail ou WhatsApp.
- Pedidos são captados para moderação, sem mural público ou publicação automática.
- SHA-256 gerado no navegador apenas como protocolo, não é blockchain nem prova de integridade do servidor.
- Clickstream de links oficiais só é transmitido se o inscrito aceitar métricas.
- Dashboard é visualização conceitual, sem resultados reais.
- Integrações Instagram, Facebook/Meta Ads e pagamentos não estão implementadas.

## Consentimentos e segurança
Contato operacional necessário, analytics opcional, marketing opcional, parceiros opcional; evitar um único aceite genérico para fins diversos.
Para produção: política de privacidade, canal de direitos do titular, exclusão/exportação, autenticação, verificação, retenção, acesso restrito e análise de impacto sobre CPF.
Galo Cadeiras: validar maior preço de cadeira inteira por partida, excluindo meia, Galo na Veia, camarotes e áreas especiais; não publicar anúncio acima do teto.
Caronas: estabelecer regras de rateio e segurança; verificar motoristas remunerados, vans e empresas antes de divulgação. Não publicar dados sensíveis.

## Arquitetura posterior
Banco PostgreSQL RLS; tabelas: members, consents, listings, listing_reviews, matches, partner_accounts, partner_packages, click_events, attributions, price_caps, audit_events, data_subject_requests.
CRM por segmento, bairro/cidade, partida, intenção, origem e conversões com consentimento.
Admin: validar preços, moderação, denúncias e aprovação de operadores.
Parceiros: funil clique -> reserva -> consumo, cálculo de investimento, receita, custo e margem baseado em dados verificáveis.
Blockchain: registro de eventos pseudonimizados em log imutável com hash encadeado e posterior ancoragem on-chain, sem publicar CPF/telefone.
Meta Graph API: Instagram automático somente após credenciais e aprovação de permissões; sempre moderar conteúdo antes de publicar.

## Publicação
Diretório local C:\Projetos\Galo-Conexoes
Netlify site ID b99598bb-06dc-4d94-a62b-28ccc3d5f11b
Comando: netlify deploy --prod --site b99598bb-06dc-4d94-a62b-28ccc3d5f11b --dir . --no-build
Verificar que os Forms foram detectados após deploy e testar com dados legítimos.
## Assistente de ingressos no WhatsApp — fase futura
O WhatsApp Cloud API + Flows pode orquestrar atendimento, preferência por jogo/setor/valor e links oficiais. Compra 100% na conversa só com API/credenciamento oficial do operador de ingressos, GaloID e biometria tratadas em canal autorizado, confirmação do comprador e checkout seguro. Nunca coletar senha, documento de biometria ou cartão no robô. Para cessão de cativa, o Super App do Atlético permanece o canal de transferência.

## Identidade visual atualizada
Referência: mockup preto/dourado Galo Conexões (celular + laptop e grade de dez módulos). Implementado em poster.css, poster_top.html, assets/logo-poster.svg e assets/photos. As fotografias são ilustrativas; conferir direitos de uso antes de comercializar. Foto do Metrô BH: Agência Minas / Wikimedia Commons, licença com atribuição.
