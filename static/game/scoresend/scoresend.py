# def check_win_condition(messages_count):
    """
    Checks if the game has been won and submits score if true
    
    Args:
        messages_count (int): Number of messages sent during the game
    """
#    if game_is_won:  # Replace with your actual win condition
        # Lower scores (fewer messages) are better
#        success = submit_score_to_leaderboard(
#            player_name="PlayerOne",
#            score=messages_count
#         )
#        
#         if success:
#             print(f"Score of {messages_count} messages submitted to leaderboard!")
#         else:
#             print("Failed to submit score to leaderboard")

import requests
import json

def submit_score_to_leaderboard(player_name: str, score: int, model_name: str = "game-v1"):
    """
    Submits the game score to a public leaderboard
    
    Args:
        player_name (str): Name of the player
        score (int): Number of messages sent (lower is better)
        model_name (str): Identifier for the game version
        
    Returns:
        bool: True if submission was successful, False otherwise
    """
    try:
        # Prepare the submission data following the leaderboard format
        submission_data = {
            "model_name": model_name,
            "submitter": player_name,
            "results": {
                "message_efficiency": {
                    "score": score,
                    "attempts": 1
                }
            },
            "timestamp": datetime.datetime.now().isoformat(),
            "status": "completed"
        }
        
        # You would replace this URL with your actual leaderboard endpoint
        leaderboard_url = "YOUR_LEADERBOARD_ENDPOINT"
        
        # Send POST request to the leaderboard
        response = requests.post(
            leaderboard_url,
            json=submission_data,
            headers={"Content-Type": "application/json"}
        )
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"Error submitting score: {str(e)}")
        return False