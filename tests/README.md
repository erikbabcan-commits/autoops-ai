# AutoOps AI - Testing Strategy

Táto zložka obsahuje centralizovanú infraštruktúru pre testovanie platformy. Riadi sa princípom **"Elite Ready"** stability.

## 📂 Štruktúra
- **`unit/`**: Testy pre čistú biznis logiku (validácie, kalkulácie, utility). Tieto testy by nemali mať žiadne React závislosti.
- **`integration/`**: Testy pre interakciu medzi viacerými modulmi. Napríklad testovanie API klienta s mockovaným serverom alebo komplexné prepojenie store-ov.
- **`components/`**: UI testy komponentov (pomocou React Testing Library). Zameriavame sa na prístupnosť a interakcie.
- **`fixtures/`**: Statické dáta a JSON mocky (napr. vzorové odpovede zo Shopify API, testovacie workflowy).
- **`mocks/`**: Manuálne mocky pre zložité externé knižnice (Lucide, Jotai, browser API).
- **`setup/`**: Konfigurácia testovacieho prostredia a globálne setup scripty.

## 🚀 Spustenie testov
```bash
npm run test        # Spustí Vitest v watch móde
npm run test:run    # Jednorazové spustenie (CI)
npm run test:ui     # Vitest UI (vizuálny prehľad)
npm run test:e2e    # Playwright E2E testy (samostatná zložka /e2e)
```

## 💡 Best Practices
1. **Co-location vs Centralization**: Malé unit testy a testy komponentov môžu byť umiestnené priamo v `src/` (napr. `button.test.tsx`). Centralizované testy v tejto zložke slúžia pre komplexnejšie scenáre a zdieľané fixtúry.
2. **AAA Pattern**: Arrange, Act, Assert.
3. **Mocking**: Mockujeme len to, čo je nevyhnutné (externé API). Logiku workflow engine-u testujeme reálne.
