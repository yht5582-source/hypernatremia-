# 高血鈉臨床導航

成人高血鈉的互動評估工具，以繁體中文引導基本評估、原因分析、補水計畫及治療追蹤。僅供醫療人員作臨床決策參考，所有估算需依實測Na與病情調整。

## 功能

- 基本評估：Na、體重、年齡、血糖、腎功能、容量、灌流及神經症狀。
- 原因分析：以尿量、Uosm、尿Na/K與病史提示攝水不足、腎外失水、低張性多尿、滲透性利尿及鈉負荷；不把提示當確診。
- 補水計畫：分開顯示總自由水缺損、首24小時矯正淨水量及持續流失；在適用條件下估算D5W或腸道自由水量。
- 治療追蹤：依台灣採血時間計算區間速度、累積下降及已測區間的24小時警示，並可列印摘要。

## 臨床計算與限制

TBW＝體重×係數。男性0.6、女性0.5；≥65歲各下修0.05，可由臨床調整係數。肥胖、明顯脫水及快速變動狀態會影響估算。

總自由水缺損＝TBW×(Na/140−1)。首24小時目標＝max(145, Na−選定下降量)，下降量預設8 mmol/L，可選6–10。首24小時矯正所需淨水量＝TBW×(Na/目標Na−1)。追加自由水量還需加持續流失並扣既有自由水輸入；未知流失不可當0。

尿液自由水清除 EFWC＝尿量×[1−(尿Na＋尿K)/血Na]；正值可供尿液持續自由水流失估算參考，負值不自動當作負流失套入。

休克、少尿、AKI、eGFR<30、容量過多、神經症狀、兒童、目標性高血鈉及重大血糖異常不產生例行D5W速度。急性有症狀鈉負荷需另走專科快速矯正路徑。0.45% NaCl不是完整自由水，本工具不直接以自由水量換算其輸液速度。

成人最佳矯正速度尚未確定；2023與2025觀察性研究的存活結果不一致。0.5 mmol/L/hr及已測區間≤24小時下降>10為複核提示，不表示所有成人都需同一矯正速度。初期每2–4小時複測Na，並重新評估血糖、K、尿量及神經狀態。

## 使用與部署

純靜態HTML/CSS/JavaScript，無外部套件及伺服器，從網頁伺服器開啟index.html即可。ES modules需經HTTP/HTTPS使用。資料僅保留於本頁記憶體，重新整理即清除，不上傳、不使用localStorage。

GitHub Pages可選擇Settings → Pages → Source：GitHub Actions，使用附帶的pages.yml；也可選Deploy from a branch → main → / (root)。啟用後，main更新會觸發發佈。

## 文獻

1. [Yun et al. KJIM 2023](https://www.kjim.org/journal/view.php?number=170760)
2. [Feigin et al. JAMA Network Open 2023](https://pubmed.ncbi.nlm.nih.gov/37768662/)
3. [Chacon-Palma et al. Kidney360 2025](https://pubmed.ncbi.nlm.nih.gov/40152929/)
4. [Hypernatremia, StatPearls](https://www.ncbi.nlm.nih.gov/books/NBK441960/)
5. [Yessayan et al. Seminars in Dialysis 2021](https://pubmed.ncbi.nlm.nih.gov/34218456/)

版本1.0；文獻核對日期：2026-10-05。
