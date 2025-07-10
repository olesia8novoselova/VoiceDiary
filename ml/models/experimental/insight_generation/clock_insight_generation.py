import time
import os
import json
from datetime import datetime
from importlib import import_module

# Configuration
OUTPUT_DIR = "ml/outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_analyzer(module_path, analyzer_class=None):
    """Dynamically import analyzer from module"""
    module = import_module(module_path.replace('/', '.').replace('.py', ''))
    if analyzer_class:
        return getattr(module, analyzer_class)()
    return module  # For modules with direct functions

def run_benchmark(sample_texts):
    """Run all analyzers and collect results with timing"""
    timestamp = datetime.now().isoformat()
    results = {
        "timestamp": timestamp,
        "samples": {f"sample_{i}": text for i, text in enumerate(sample_texts, 1)},
        "models": {}
    }
    
    # Model configurations
    models_config = [
        {
            "name": "OpenHermes-Mistral",
            "module": "ml.models.production.mistral_insight_generation",
            "analyzer_func": "analyze_text",
            "display_name": "OpenHermes 2.5 Mistral 7B"
        },
        {
            "name": "RoBERTa-base",
            "module": "ml.models.experimental.insight_generation.test_RoBERTa_base",
            "analyzer_class": "ClinicalRobertaAnalyzer",
            "method": "analyze_text",
            "format_func": "format_for_ui",
            "display_name": "RoBERTa-base (Clinical)"
        },
        {
            "name": "RoBERTa-base+2other",
            "module": "ml.models.experimental.insight_generation.test_RoBERTa_base_2other",
            "analyzer_class": "PsychologicalAnalyzer",
            "method": "analyze_text",
            "display_name": "RoBERTa-base + 2 Models"
        }
    ]
    
    for config in models_config:
        model_results = {
            "executions": [],
            "metadata": {
                "implementation": config["module"],
                "display_name": config["display_name"]
            }
        }
        
        try:
            # Load analyzer
            if "analyzer_class" in config:
                analyzer = load_analyzer(config["module"], config["analyzer_class"])
                analyze_method = getattr(analyzer, config["method"])
                format_func = getattr(analyzer, config["format_func"]) if "format_func" in config else None
            else:
                module = load_analyzer(config["module"])
                analyze_method = getattr(module, config["analyzer_func"])
                format_func = None
            
            # Run analysis for each sample
            for sample_id, text in results["samples"].items():
                start_time = time.time()
                
                try:
                    raw_result = analyze_method(text)
                    elapsed = time.time() - start_time
                    
                    # Format output if needed
                    output = format_func(raw_result) if format_func else raw_result
                    
                    # Clean output for JSON (in case some models return already formatted strings)
                    try:
                        if isinstance(output, str):
                            output = json.loads(output)
                    except json.JSONDecodeError:
                        pass
                    
                    model_results["executions"].append({
                        "sample": sample_id,
                        "time_sec": round(elapsed, 4),
                        "output": output,
                        "status": "success"
                    })
                    
                except Exception as e:
                    model_results["executions"].append({
                        "sample": sample_id,
                        "time_sec": -1,
                        "error": str(e),
                        "status": "error"
                    })
                
        except Exception as e:
            model_results["error"] = f"Failed to initialize analyzer: {str(e)}"
        
        results["models"][config["name"]] = model_results
    
    return results

def save_results(results):
    """Save results to JSON file with timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{OUTPUT_DIR}/model_benchmark_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"Benchmark results saved to {filename}")
    return filename

def main():
    # Sample texts (same as in your model test files)
    sample_texts = [
        """Today started well: I got a promotion email at 9 AM and felt excited. 
        But by 4 PM, I saw my credit bill and anxiety spiked. My heart raced for 20 minutes. 
        Later, chatting with my wife calmed me down, while scrolling Instagram made things worse.""",
        
        """Ugh today was... I don't even know. Woke up at 11 because why not, skipped breakfast again. 
        The meeting with Sarah was fine I guess but then Mark said that thing about my presentation 
        and I just - you know? Walked out to get coffee, tripped on the stairs (classic), spilled 
        it everywhere. Called mom but she was busy with her book club. 
        Later at the gym, some guy kept staring at me while I was on the treadmill which was weird 
        but also kinda flattering? Ate a whole pizza watching Netflix. Now it's 3am and I'm wondering 
        why I can't sleep even though I'm exhausted. Tomorrow's another day I suppose. PS: My knee hurts 
        from the fall but whatever.""",
        
        """Monday standup: TeamLead: 'Status?' Alex: 'Debugging payment gateway API, 3/5 tasks complete.'
        Sam: 'Optimizing database queries, found 2 slow joins.' Jamie: 'Writing tests for auth service, 80% coverage.'
        TeamLead: 'Blockers?' Alex: 'Waiting on Stripe docs.' Sam: 'None.' Jamie: 'Need QA env access.' Wednesday
        check-in: TeamLead: 'Midweek update?' Alex: 'Finished gateway fixes, now load testing.' Sam: 'Query optimization
        complete.' Jamie: 'PR review pending.' Friday standup: TeamLead: 'Status?' Alex: 'Debugging payment gateway API,
        3/5 tasks complete.' Sam: 'Query optimization done, moved to index tuning.' Jamie: 'Completed auth tests,
        reviewing PR 142.' TeamLead: 'Bottlenecks?' Alex: 'Load test dependencies.' Sam: 'None.'
        Jamie: 'PR feedback delays.' Friday retro: TeamLead: 'Weekly summary?' Alex: 'Shipped payment updates, 10% perf gain.'
        Sam: 'Reduced query times by 300ms avg.' Jamie: 'Merged auth tests, fixed 3 security gaps.' TeamLead: 'Next week?'
        Alex: 'Start fraud detection PoC.' Sam: 'Schema versioning research.' Jamie: 'OAuth implementation.'"""
    ]
    
    print("Running psychological analysis benchmark...")
    results = run_benchmark(sample_texts)
    report_file = save_results(results)
    
    print("\nBenchmark completed!")
    print(f"Results saved to: {report_file}")

if __name__ == "__main__":
    main()