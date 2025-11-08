import { Injectable } from '@nestjs/common';
import { GiftSessionDto } from './dto/gift-session.dto';
import { GiftFormat } from '@prisma/client';
import { GiftResponseDto } from './dto/gift-respone.dto';
import { InfiniteScrollPaginationDto } from '../dto/pagination.dto';
import { setTimeout } from 'timers/promises';

@Injectable()
export class GiftSessionService {
  async collectGiftSessionData(
    data: GiftSessionDto,
    pagination: InfiniteScrollPaginationDto,
  ): Promise<GiftResponseDto> {
    const response: GiftResponseDto = {};

    const formatLinks: Record<GiftFormat, string[]> = {
      [GiftFormat.WILDBERRIES]: [
        'https://www.wildberries.ru/catalog/220043185/detail.aspx',
        'https://www.wildberries.ru/catalog/290444579/detail.aspx',
        'https://www.wildberries.ru/catalog/143426478/detail.aspx',
      ],
      [GiftFormat.OZON]: [
        'https://www.ozon.ru/product/nabor-aromakamney-pion-aromaticheskiy-diffuzor-dlya-doma-sashe-dlya-efirnyh-masel-2859224805/?at=08tYPQ5QjcnONOzEtMyqlJjSP9z01jSxzJYz3f0lAzWo',
        'https://www.ozon.ru/product/ecolatier-parfyumirovannyy-sprey-dlya-doma-aromaticheskiy-sprey-dlya-tekstilya-vanilla-wood-300-ml-1695826959/?at=Y7tjBmqm5crMqDoKFOY0Xls6ARPVGsn5QnOxsXmVny1',
        'https://www.ozon.ru/product/proektsiya-logotipa-avtomobilya-2-sht-art-honda-accord-7-8-2003-2015-zm-2-shtuki-900735543/?at=J8tgMlvlxTGDMxArtwM39xnFyNXyVQsJEVMQVu2VEmPr',
        'https://www.ozon.ru/product/kovrik-protivoskolzyashchiy-v-mashinu-rezinovyy-dlya-honda-1893787470/?at=qQtJwn3n9c4zmAADSJXgpoqc9Q94MBuo3PVyLiP7JzOg',
      ],
      [GiftFormat.YANDEX_MARKET]: [
        'https://market.yandex.ru/card/organayzer-dlya-kosmetiki/102027344181?hid=90401&show-uid=17626111900666945687706006&from=search&cpa=1&do-waremd5=4IhYHIC1-ETFHdDIydttJA&sponsored=1&cpc=xuIDGYtbbWHfdMwSe91RFrLBU3o__LXXG7P_frkMITgePixec4ElWvs1olqHCuKU9V6Ylxlz_OPuvdINIxIUKq0kTRppuEN3ioAQ3IQohfZs2HJ0X4zAURaqdpC_tOpAGcwVKFMCdkiSQUeJmgpPOnU3cnXpXk96jAbrc4LqucRJYD-Tt9vO-Uo0XIBuG47w9vHKiUYx7qjfITkSlIsQH3w5EShR-bJ_ly0Yv5dSBU6rhhWxckEFpx9KplX813gs3b3LA5wt95t2LlxJ3WVXVWQgM041ZjTTORimxUVG5pTXAxwiPxPOVVBHYR1a3ouFOeEhiHvCwKr2utj2MdfPyA_qbVgNeP54Fyf4f9tw2jTElZMkLtf_GSC2giYyTpo76hum9xqRdSyekPUoHJz3KnMyq3EbQdh96KK1uVsT1Vbs16myYAn1wX0gkcLVD-5UBrG5k4dztaoWY1PHxIBoT7kGtm9k-qsDdg1dmBgUe6OI66cqiYy9EXn2vJ_Zvy1OZrDgzfg0noIqyGQ18kB9U30Jki5cKsMHpg6EVkdEaPyJpPSsZ-FgIci-wWP_IZYGgLbQMlBK45K5UPpMOhneHEuHrbhC6E3B68QJsLrqyCH3zNiPfLIy77QkThh_PDv7mn8SOJZnLtlO991LoOfbZA20ZfR3_2W7uhrVe_Tvepg1JXSyKeUGI4XTPYx3X-1FgnhK6K2hio05Ro-kvpq0cCnJqXyS2yDaBQPUZnLohVc%2C&cc=CiBjNzZmNzQ4Y2I0NWE5MGYzYmY5YWYwMjgxZDFkODUwZhDnAYB95u0G',
        'https://market.yandex.ru/card/v-dom-uyut-korzina-dlya-khraneniya-dlina-32-sm-shirina-24-sm-vysota-16-sm/4735043773?hid=90401&show-uid=17626111932294247161206011&from=search&cpa=1&do-waremd5=yAGlLzTA5_pc3ddT0JLHjw&sponsored=1&cpc=PNJ5yemCSIm1eTK_SmHQ1h5CYdCcfMG4C9HrVK_tfqNMR5lIc7NwOkOOqfauoRi1VaV1Xf535R_pA5T6QxXLS1tINMqRknew92cRaRrE5slvGHzxK28Yh7URyhAJNXEIsjaPVGgdGcFBka_gRcPO2xBAy3dk8iCRyzKJWUFn0cKjh8Fb2n5NzZ6UlgaHW07GRRHeahJJjLuMH8kEcoeHRyZnNPNYjEqpBRXU9YE9grKEXf4RoF1WJI8mhNZaC7E0L_zao2QIobqXqTK4rY_NhoIAxIYF4W_hsfG3INYMvt4NxexrQQIDMooM2Zx9hPCjFm8HGucMz5jfREOUqEBZoY2KqIH1ziIWeO1zzvNf6mWX2vT2RJoPtxCuEe0sx7CdJrmxEqEOSFJ2pG78RSpfkWRTdj9FbJPb3x9_jZIEKxR9N1raLET19j69RyEBRX2j5jx5N_EdsdR4Ovl4mcI68SErn_hu16Z4se5WClUMrmX-K1iIIIIfkL4anf_W7ZZELCy3mQ5B7Ev21RohkvNDadO4H6JsWhXiUu1IkJyGk3h9OhZ7D8WnfwPvLR45kIG8CQcgLvydwd6l2eRao5SgaG7oc0ymBOFOYaBcCPYOKV2NeEqGPQUoNz7tQTPgk3QOH9Cr9Jo_hQV6PwyJ3YNdg_kjbyrPg3wEw91Ie6eB0bqlDCb6FBDgKPIHuWUcsctyi581P2vSy8LKs4yIcbluoOPtqG_0gd_cEBI0VWm9lHA%2C&cc=CiA2OGM5ZDcxM2U4ODFiYmU2NzFiMmJmYjg0ZTM1NWEzNRDnAYB95u0G',
        'https://market.yandex.ru/card/prochnyye-universalnyye-chekhly-na-avtomobilnyye-sidenya-dlya-honda-fit-city-accord-7-8-civic-jazz-vezel-crv-podushka-avto-aksessuary-dlya-interyera-2pcs-black/4575251645?hid=90401&show-uid=17626112322258482260106003&from=search&cpa=1&do-waremd5=a2-GE0QqkNiBswqtphkk7A&sponsored=1&cpc=cntzQ6JHlDLvwWqABrpI9udskYiihlVEUC96zK9OgU0fKlTNpPHlA6XC7T31Z7pwmlg5N6N4PCCu8gKOapAKf2HZMrLoFkMghtQ2uGKu2CIwfKx3xQ0oms5XH3VJkjpSHnrlMjQ1m5A0XTFpmlCIwY7-cP9gxRISa_1D5ClZ5IuUk9clZymyr3TiBO5OE_9ARtT_iCQ8wtpXeMUabKkXfgMEA-Y17desU7r0nFOrTwRA_KxkzeN3uJoDJhyy73XIWR4AhhS4elvutVBmDD7hW5uenbzGcM6YwQQLNMJH5PDv9nnIIKctNoY9dhlBwlDGaJMS7Vhy7374NIBk5ytk0pSME0up9kfAlxWunY-J8h_th4Tz-vbRgxkwpwIz3pih7yiKjQ7LKZVSoUyBuiojxTJZ0VYBnHF1_PH1afu8W_bADC7jCvNTPoZZ4gDRBdj3P6bBvV8xV8rsCQYXnnn4NR5dS9zU7uVOlrq6mB1p2sLwAGM3PLz-Bq3nZ6WDPve6InG6vEUeSNTydRsgaiL0XFAx-qX8IVzlraq6v7Yoj3UvombmzrO7uJPschWqPqQFFC04FldHsPeXYjJ6HJmSk-O3mNl5IIeaB20lHTF302_d1VClj8xKacb9aiiiTZ53cXY1mIl6PYqIAy6HsA6RM0wQ9n_mER5PQXV4XNLVzgOBW1W8tN_DNFQqWXRjiF7KJfHHwsAmPvE7NnbyepZmxmFh-QFVLe88JS2lAwPRXp6gz0NMUmJgkQ%2C%2C&cc=CiA4YjZkNzczNDU2MzgwYzUxZGEzYmI5OGVlODkwOTk1MRDnAYB95u0G'
      ],
      [GiftFormat.IDEA_ONLY]: [
        'пока',
        'не решил'
      ],
    };

    data.base.formats.forEach((format) => {
      if (formatLinks[format]) {
        response[format] = formatLinks[format];
      }
    });

    await setTimeout(Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000);

    return response;
  }
}
