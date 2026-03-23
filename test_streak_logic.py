from datetime import date, timedelta

def get_semanas_racha_logic(now):
    # Determine target month based on ISO week of today
    iso_weekday = now.isoweekday() # 1=Mon, 7=Sun
    current_thursday = now + timedelta(days=(4 - iso_weekday))
    target_year = current_thursday.year
    target_month = current_thursday.month
    
    # First Thursday of the target month
    first_of_month = date(target_year, target_month, 1)
    # weekday(): 0=Mon, ..., 6=Sun
    first_thursday = first_of_month + timedelta(days=(3 - first_of_month.weekday() + 7) % 7)
    
    # Monday of that first ISO week
    start_monday = first_thursday - timedelta(days=3)
    
    weeks = []
    for i in range(4):
        inicio = start_monday + timedelta(weeks=i)
        fin = inicio + timedelta(days=6)
        weeks.append((inicio, fin))
    return target_month, weeks

def test():
    # March 1, 2026 (Sun) - Should be Feb
    res = get_semanas_racha_logic(date(2026, 3, 1))
    print(f"Date: 2026-03-01 (Sun) -> Target Month: {res[0]} (Feb)")
    
    # March 2, 2026 (Mon) - Should be Mar
    res = get_semanas_racha_logic(date(2026, 3, 2))
    print(f"Date: 2026-03-02 (Mon) -> Target Month: {res[0]} (Mar)")
    print(f"  Week 1: {res[1][0][0]} to {res[1][0][1]} (Should be 2-8)")
    
    # March 23, 2026 (Mon) - Should be Mar
    res = get_semanas_racha_logic(date(2026, 3, 23))
    print(f"Date: 2026-03-23 (Mon) -> Target Month: {res[0]} (Mar)")
    print(f"  Week 4: {res[1][3][0]} to {res[1][3][1]} (Should be 23-29)")

    # March 30, 2026 (Mon) - Should be Apr
    res = get_semanas_racha_logic(date(2026, 3, 30))
    print(f"Date: 2026-03-30 (Mon) -> Target Month: {res[0]} (Apr)")
    print(f"  Week 1: {res[1][0][0]} to {res[1][0][1]} (Should be Mar 30 - Apr 5)")

if __name__ == "__main__":
    test()
