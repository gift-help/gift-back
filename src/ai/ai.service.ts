import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GiftSessionDto } from '../gift-session/dto/gift-session.dto';
import { Occasion } from '@prisma/client';
import type { TIdea } from '../types/finalResponse';

const mockText = '```\n' +
  '{\n' +
  '  "ideas": [\n' +
  '    {\n' +
  '      "title": "Умный робот-газонокосилка",\n' +
  '      "search_query": "умный робот газонокосилка",\n' +
  '      "description": "Этот подарок поможет поддерживать ухоженный вид газона на территории, что соответствует интересам в садоводстве."\n' +
  '    },\n' +
  '    {\n' +
  '      "title": "Подписка на кулинарные мастер-классы",\n' +
  '      "search_query": "подписка на кулинарные мастер-классы онлайн",\n' +
  '      "description": "Подарит возможность узнать что-то новое в области кулинарии и разнообразить домашний досуг."\n' +
  '    },\n' +
  '    {\n' +
  '      "title": "Фитнес-браслет с функциями умного помощника",\n' +
  '      "search_query": "фитнес-браслет умный помощник",\n' +
  '      "description": "Поможет отслеживать активность и здоровье, что соответствует интересам в спорте и здоровом образе жизни."\n' +
  '    },\n' +
  '    {\n' +
  '      "title": "Настольная лампа с регулировкой яркости и цвета",\n' +
  '      "search_query": "настольная лампа умная регулировка яркости цвета",\n' +
  '      "description": "Позволит создать комфортное освещение для чтения и отдыха, что идеально подходит для просмотра сериалов."\n' +
  '    },\n' +
  '    {\n' +
  '      "title": "Набор для барбекю с аксессуарами",\n' +
  '      "search_query": "набор для барбекю аксессуары",\n' +
  '      "description": "Идеальный подарок для любителя кулинарии и отдыха на природе, позволит наслаждаться приготовлением пищи на мангале."\n' +
  '    }\n' +
  '  ]\n' +
  '}\n' +
  '```'

@Injectable()
export class AiService {
  private readonly apiKey = process.env.YANDEX_API_KEY || '';

  getCyrillicOccasion = (occasion: Occasion): string => {
    const occasionMap: Record<Occasion, string> = {
      [Occasion.BIRTHDAY]: 'День рождения',
      [Occasion.NEW_YEAR]: 'Новый год',
      [Occasion.WEDDING]: 'Свадьба',
      [Occasion.ANNIVERSARY]: 'Годовщина',
      [Occasion.MARCH_8]: '8 марта (международный женский день)',
      [Occasion.FEBRUARY_23]: '23 февраля (день защитника отечества)',
      [Occasion.JUST_BECAUSE]: 'Просто так (без повода, по собственному желанию)',
      [Occasion.OTHER]: 'Другое',
    };
    return occasionMap[occasion];
  };

  async generateGiftIdeas(personDescription: GiftSessionDto): Promise<TIdea[]> {
    const { base, ...rest } = personDescription;

    const filteredDescription = [
      `Возраст: ${base.age}`,
      `Пол: ${base.gender}`,
      `Повод для подарка: ${
        base.occasion === Occasion.OTHER && base.customOccasion
          ? base.customOccasion
          : this.getCyrillicOccasion(base.occasion)
      }`,
      rest.simpleDescription ? `Описание: ${rest.simpleDescription}` : null,
      rest.tags
        ? `Интересы: ${Object.entries(rest.tags)
          .map(([_, answers]) => `${answers.join(', ')}`)
          .join('. ')}`
        : null,
      rest.answers ? `Дополнительно: ${rest.answers.join(', ')}` : null,
    ];

    const prompt = `
      На основе описания человека, предложи 15 разных идей подарков, охватывающие разные категории и бюджеты.
      ${filteredDescription.join(', ')}
      Требования к ответу:
      1. Верни ТОЛЬКО валидный JSON без дополнительных текстов
      2. Каждая идея должна содержать:
         - "title": "Креативное и понятное название идеи для пользователя + подходящий смайлик в начале" (например, "🤓Умный гаджет")
         - "search_query": "Оптимизированная поисковая фраза для WildBerries для конкретных товаров" (например, "умный дом гаджет автоматизация")
         - "description": "Краткое пояснение, почему этот подарок подходит (1-2 предложения)"
      Пример: {"ideas":[{"title":"Пример","search_query":"пример запрос","description":"Описание"}]}
    `;

    const body = {
      modelUri: 'gpt://b1g3nrtuc9d8hit7c6vj/yandexgpt-lite',
      completionOptions: {
        maxTokens: 800,
        temperature: 0.6,
      },
      messages: [
        {
          role: 'user',
          text: prompt,
        },
      ],
    };

    const response = await axios.post(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Api-Key ${this.apiKey}`,
        },
      },
    );

    const text = response.data.result?.alternatives?.[0]?.message?.text ?? '[]';

    try {
      return parseStringToIdeas(text);
    } catch {
      return [text];
    }
  }
}

export function parseStringToIdeas(input: string): TIdea[] {
  // Удаляем тройные кавычки ``` (в начале и в конце)
  const cleaned = input.replace(/^```|```$/g, '').trim();
  try {
    // Парсим весь JSON
    const parsed = JSON.parse(cleaned);
    console.log('parsed', parsed);

    // Проверяем, что это объект с массивом ideas
    if (parsed && parsed.ideas && Array.isArray(parsed.ideas)) {
      return parsed.ideas;
    }

    // Если это просто массив (без поля ideas), возвращаем его
    if (Array.isArray(parsed)) {
      return parsed;
    }

    // Если это строка с массивом (редкий случай)
    if (typeof parsed === 'string') {
      const nestedMatch = parsed.match(/\[(.|\s)*\]/);
      if (nestedMatch) {
        return JSON.parse(nestedMatch[0]);
      }
    }

    return [];

  } catch (e) {
    console.error('Parsing error:', e);

    // Пробуем найти JSON в строке если парсинг всей строки не удался
    try {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed && parsed.ideas && Array.isArray(parsed.ideas)) {
          return parsed.ideas;
        }
      }
    } catch (e2) {
      console.error('Fallback parsing error:', e2);
    }

    return [];
  }
}
